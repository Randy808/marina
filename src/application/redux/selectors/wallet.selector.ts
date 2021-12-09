import {
  AccountID,
  createMnemonicAccount,
  MnemonicAccount,
  MainAccountID,
  Account,
} from '../../../domain/account';
import { MasterPublicKey, UnblindedOutput } from 'ldk';
import { RootReducerState } from '../../../domain/common';
import { TxDisplayInterface } from '../../../domain/transaction';

export function masterPubKeySelector(state: RootReducerState): Promise<MasterPublicKey> {
  return selectMainAccount(state).getWatchIdentity();
}

export const selectUtxos =
  (...accounts: AccountID[]) =>
  (state: RootReducerState): UnblindedOutput[] => {
    return accounts.flatMap((ID) => selectUtxosForAccount(ID)(state));
  };

const selectUtxosForAccount =
  (accountID: AccountID) =>
  (state: RootReducerState): UnblindedOutput[] => {
    return Object.values(selectUnspentsAndTransactions(accountID)(state).utxosMap);
  };

export const selectTransactions =
  (...accounts: AccountID[]) =>
  (state: RootReducerState) => {
    return accounts.flatMap((ID) => selectTransactionsForAccount(ID)(state));
  };

const selectTransactionsForAccount =
  (accountID: AccountID) =>
  (state: RootReducerState): TxDisplayInterface[] => {
    return Object.values(
      selectUnspentsAndTransactions(accountID)(state).transactions[state.app.network]
    );
  };

export function hasMnemonicSelector(state: RootReducerState): boolean {
  return (
    state.wallet.mainAccount.encryptedMnemonic !== '' &&
    state.wallet.mainAccount.encryptedMnemonic !== undefined
  );
}

export function selectMainAccount(state: RootReducerState): MnemonicAccount {
  return createMnemonicAccount(state.wallet.mainAccount, state.app.network);
}

export const selectAllAccounts = (state: RootReducerState): Account[] => {
  const mainAccount = selectMainAccount(state);
  return [mainAccount];
};

export const selectAllAccountsIDs = (state: RootReducerState): AccountID[] => {
  return selectAllAccounts(state).map((account) => account.getAccountID());
};

export const selectAccount = (
  accountID: AccountID
): ((state: RootReducerState) => Account | undefined) => {
  if (accountID === MainAccountID) {
    return selectMainAccount;
  }

  // TODO multiple accounts: we need to modify the way we select account via ID
  return () => undefined;
};

// By definition, each asset hash should be associated with a single Account
export const selectAccountForAsset = (_: string) => (state: RootReducerState) => {
  return selectMainAccount(state);
};

export const selectUnspentsAndTransactions =
  (accountID: AccountID) => (state: RootReducerState) => {
    return (
      state.wallet.unspentsAndTransactions[accountID] ?? {
        utxosMap: {},
        transactions: { regtest: {}, liquid: {} },
      }
    );
  };

export const selectDeepRestorerIsLoading = (state: RootReducerState) => {
  return state.wallet.deepRestorer.isLoading;
};

export const selectDeepRestorerGapLimit = (state: RootReducerState) => {
  return state.wallet.deepRestorer.gapLimit;
};

export const selectUpdaterIsLoading = (state: RootReducerState) => {
  return state.wallet.updaterLoaders > 0;
};
