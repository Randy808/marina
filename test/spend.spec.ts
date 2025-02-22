import type { Mnemonic, UnblindedOutput } from 'ldk';
import { decodePset, fetchAndUnblindUtxos, networks, payments, Transaction } from 'ldk';
import { makeRandomMnemonic } from './test.utils';
import { APIURL, broadcastTx, faucet } from './_regtest';
import { blindAndSignPset, createSendPset } from '../src/application/utils/transaction';
import * as ecc from 'tiny-secp256k1';

jest.setTimeout(15000);

const network = networks.regtest;

const RECEIVER = 'AzpofttCgtcfk1PDWytoocvMWqQnLUJfjZw6MVmSdJQtwWnovQPgqiWSRTFZmKub3BNEpLYkyrr4czSp';
const UNCONFIDENTIAL_ADDRESS = 'ert1q5xt7rk3cs0xuk5vkvzf9ks3k3vch755c27au29';

describe('create send pset (build, blind & sign)', () => {
  const mnemonic: Mnemonic = makeRandomMnemonic();
  const unspents: UnblindedOutput[] = [];

  const makeUnspents = async () => {
    const addr = await mnemonic.getNextAddress();
    await faucet(addr.confidentialAddress, 10000);
    const u = await fetchAndUnblindUtxos(ecc, [addr], APIURL);
    unspents.push(...u);
    return u;
  };

  const makeChangeAddressGetter = async (): Promise<[string, () => string]> => {
    const addr = (await mnemonic.getNextChangeAddress()).confidentialAddress;
    return [addr, () => addr];
  };

  const makeRecipients = (values: Array<{ value: number }>, address = RECEIVER) =>
    values.map(({ value }) => ({
      address,
      asset: network.assetHash,
      value,
    }));

  const blindAndSign = (pset: string, changeAddress: string) =>
    blindAndSignPset(pset, unspents, [mnemonic], [RECEIVER], [changeAddress]);

  test('address should have a public key', async () => {
    const addr = await mnemonic.getNextAddress();
    expect(addr.publicKey).toHaveLength(66);
  });

  test('should be able to create a transaction with an unconfidential address', async () => {
    const [changeAddress, getChangeAddress] = await makeChangeAddressGetter();

    const { pset } = await createSendPset(
      makeRecipients([{ value: 100000 }, { value: 11000 }], UNCONFIDENTIAL_ADDRESS),
      await makeUnspents(),
      network.assetHash,
      getChangeAddress,
      'regtest'
    );

    const signed = await blindAndSign(pset, changeAddress);
    const txid = await broadcastTx(signed);
    expect(txid).toHaveLength(64);
  });

  test('should be able to create a regular transaction', async () => {
    const [changeAddress, getChangeAddress] = await makeChangeAddressGetter();

    const { pset } = await createSendPset(
      makeRecipients([{ value: 100000 }, { value: 11000 }]),
      await makeUnspents(),
      network.assetHash,
      getChangeAddress,
      'regtest'
    );

    const decoded = decodePset(pset);
    expect(decoded.data.outputs).toHaveLength(4); // recipients outputs (2) + fee output + change output
    expect(decoded.data.inputs).toHaveLength(1); // should select the faucet unspent

    const signed = await blindAndSign(pset, changeAddress);
    await broadcastTx(signed);
  });

  test('should be able to create a transaction with OP_RETURN data', async () => {
    const OP_RETURN_DATA = '6666666666666666';

    const [changeAddress, getChangeAddress] = await makeChangeAddressGetter();

    const { pset } = await createSendPset(
      makeRecipients([{ value: 200 }]),
      await makeUnspents(),
      network.assetHash,
      getChangeAddress,
      'regtest',
      [{ data: OP_RETURN_DATA, value: 120, asset: network.assetHash }]
    );

    const decoded = decodePset(pset);
    expect(decoded.data.outputs).toHaveLength(4); // recipient output + fee output + change output + OP_RETURN output
    expect(decoded.data.inputs).toHaveLength(1); // should select the faucet unspent

    const signed = await blindAndSign(pset, changeAddress);
    const signedTx = Transaction.fromHex(signed);
    const opReturnScript = payments
      .embed({ data: [Buffer.from(OP_RETURN_DATA, 'hex')], network })
      .output!.toString('hex');

    expect(signedTx.outs.map((o) => o.script.toString('hex'))).toContain(opReturnScript);

    await broadcastTx(signed);
  });

  test('createSendPset should return selected utxos', async () => {
    const [changeAddress, getChangeAddress] = await makeChangeAddressGetter();

    const unspents = await makeUnspents();

    const { pset, selectedUtxos } = await createSendPset(
      makeRecipients([{ value: 100000 }, { value: 11000 }]),
      unspents,
      network.assetHash,
      getChangeAddress,
      'regtest'
    );

    // should return selected utxos and it should be the faucet unspent
    expect(Object.keys(selectedUtxos)).toHaveLength(1);
    expect(selectedUtxos[0].txid).toEqual(unspents[0].txid);

    const signed = await blindAndSign(pset, changeAddress);
    const txid = await broadcastTx(signed);
    expect(txid).toHaveLength(64);
  });
});
