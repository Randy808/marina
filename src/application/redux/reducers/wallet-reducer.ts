/* eslint-disable @typescript-eslint/restrict-plus-operands */
import { toStringOutpoint } from './../../utils/utxos';
import * as ACTION_TYPES from '../actions/action-types';
import type { WalletState } from '../../../domain/wallet';
import type { AnyAction } from 'redux';
import type { AccountData, AccountID, CustomScriptAccountData } from '../../../domain/account';
import { AccountType, initialRestorerOpts, MainAccountID } from '../../../domain/account';
import type { TxDisplayInterface } from '../../../domain/transaction';
import { newEmptyUtxosAndTxsHistory } from '../../../domain/transaction';
import type { NetworkString, UnblindedOutput } from 'ldk';
import { lockedUtxoMinimunTime } from '../../utils/constants';

export const walletInitState: WalletState = {
  encryptedMnemonic: '',
  accounts: {
    [MainAccountID]: {
      type: AccountType.MainAccount,
      masterBlindingKey: '',
      masterXPub: '',
      restorerOpts: {
        liquid: initialRestorerOpts,
        testnet: initialRestorerOpts,
        regtest: initialRestorerOpts,
      },
    },
  },
  unspentsAndTransactions: {
    [MainAccountID]: newEmptyUtxosAndTxsHistory(),
  },
  passwordHash: '',
  deepRestorer: {
    gapLimit: 20,
    restorerLoaders: 0,
  },
  updaterLoaders: 0,
  isVerified: false,
  lockedUtxos: {},
};

// returns only utxos locked for less than 5 minutes
const filterOnlyRecentLockedUtxos = (state: WalletState) => {
  const expiredTime = Date.now() - lockedUtxoMinimunTime; // 5 minutes
  const lockedUtxos: Record<string, number> = {};
  for (const key of Object.keys(state.lockedUtxos)) {
    const isRecent = state.lockedUtxos[key] > expiredTime;
    if (isRecent) lockedUtxos[key] = state.lockedUtxos[key];
  }
  return lockedUtxos;
};

const addUnspent =
  (state: WalletState) =>
  (accountID: AccountID, utxo: UnblindedOutput, network: NetworkString): WalletState => {
    return {
      ...state,
      unspentsAndTransactions: {
        ...state.unspentsAndTransactions,
        [accountID]: {
          ...state.unspentsAndTransactions[accountID],
          [network]: {
            ...state.unspentsAndTransactions[accountID][network],
            utxosMap: {
              ...state.unspentsAndTransactions[accountID][network].utxosMap,
              [toStringOutpoint(utxo)]: utxo,
            },
          },
        },
      },
    };
  };

const addUnconfirmed =
  (state: WalletState) =>
  (
    unconfirmedUtxos: UnblindedOutput[],
    accountID: AccountID,
    network: NetworkString
  ): WalletState => {
    const unconfirmedUtxosMap: Record<string, UnblindedOutput> = {};
    for (const utxo of unconfirmedUtxos) {
      unconfirmedUtxosMap[toStringOutpoint(utxo)] = utxo;
    }
    return {
      ...state,
      unspentsAndTransactions: {
        ...state.unspentsAndTransactions,
        [accountID]: {
          ...state.unspentsAndTransactions[accountID],
          [network]: {
            ...state.unspentsAndTransactions[accountID][network],
            utxosMap: {
              ...state.unspentsAndTransactions[accountID][network].utxosMap,
              ...unconfirmedUtxosMap,
            },
          },
        },
      },
    };
  };

const addTx =
  (state: WalletState) =>
  (accountID: AccountID, tx: TxDisplayInterface, network: NetworkString): WalletState => {
    return {
      ...state,
      unspentsAndTransactions: {
        ...state.unspentsAndTransactions,
        [accountID]: {
          ...state.unspentsAndTransactions[accountID],
          [network]: {
            ...state.unspentsAndTransactions[accountID][network],
            transactions: {
              ...state.unspentsAndTransactions[accountID][network].transactions,
              [tx.txId]: tx,
            },
          },
        },
      },
    };
  };

export function walletReducer(
  state: WalletState = walletInitState,
  { type, payload }: AnyAction
): WalletState {
  switch (type) {
    case ACTION_TYPES.RESET_WALLET: {
      return walletInitState;
    }

    case ACTION_TYPES.SET_RESTORER_OPTS: {
      const accountID = payload.accountID as AccountID;
      const network = payload.network as NetworkString;
      return {
        ...state,
        accounts: {
          ...state.accounts,
          [accountID]: {
            ...state.accounts[accountID],
            restorerOpts: {
              ...state.accounts[accountID].restorerOpts,
              [network]: payload.restorerOpts,
            },
          },
        },
      };
    }

    case ACTION_TYPES.SET_MNEMONIC: {
      return {
        ...state,
        encryptedMnemonic: payload.encryptedMnemonic,
        passwordHash: payload.passwordHash,
      };
    }

    case ACTION_TYPES.SET_CS_ACCOUNT_IS_SPENDABLE_BY_MARINA: {
      return {
        ...state,
        accounts: {
          ...state.accounts,
          [payload.accountID as AccountID]: {
            ...state.accounts[payload.accountID],
            covenantDescriptors: {
              ...state.accounts[payload.accountID].covenantDescriptors,
              isSpendableByMarina: payload.isSpendableByMarina,
            },
          },
        },
      };
    }

    case ACTION_TYPES.SET_CS_ACCOUNT_TEMPLATE: {
      const accountID = payload.accountID as AccountID;
      if (state.accounts[accountID]?.type !== AccountType.CustomScriptAccount) return state;

      const accountWithTemplate: CustomScriptAccountData = {
        ...(state.accounts[accountID] as CustomScriptAccountData),
        covenantDescriptors: {
          namespace: payload.accountID,
          template: payload.template,
          changeTemplate: payload.changeTemplate,
        },
      };

      return {
        ...state,
        accounts: {
          ...state.accounts,
          [accountID]: accountWithTemplate,
        },
      };
    }

    case ACTION_TYPES.SET_ACCOUNT_DATA: {
      const data = payload.accountData as AccountData;
      const accountID = payload.accountID as AccountID;
      return {
        ...state,
        accounts: {
          ...state.accounts,
          [accountID]: data,
        },
        unspentsAndTransactions: {
          ...state.unspentsAndTransactions,
          [accountID]: newEmptyUtxosAndTxsHistory(),
        },
      };
    }

    case ACTION_TYPES.INCREMENT_INTERNAL_ADDRESS_INDEX: {
      const accountID = payload.accountID as AccountID;
      const network = payload.network as NetworkString;
      return {
        ...state,
        accounts: {
          ...state.accounts,
          [accountID]: {
            ...state.accounts[accountID],
            restorerOpts: {
              ...state.accounts[accountID]?.restorerOpts,
              [network]: {
                ...state.accounts[accountID]?.restorerOpts[network],
                lastUsedInternalIndex: increment(
                  state.accounts[accountID]?.restorerOpts[network]?.lastUsedInternalIndex
                ),
              },
            },
          },
        },
      };
    }

    case ACTION_TYPES.INCREMENT_EXTERNAL_ADDRESS_INDEX: {
      const accountID = payload.accountID as AccountID;
      const network = payload.network as NetworkString;
      return {
        ...state,
        accounts: {
          ...state.accounts,
          [accountID]: {
            ...state.accounts[accountID],
            restorerOpts: {
              ...state.accounts[accountID]?.restorerOpts,
              [network]: {
                ...state.accounts[accountID]?.restorerOpts[network],
                lastUsedExternalIndex: increment(
                  state.accounts[accountID]?.restorerOpts[network]?.lastUsedExternalIndex
                ),
              },
            },
          },
        },
      };
    }

    case ACTION_TYPES.ADD_UTXO: {
      return addUnspent(state)(payload.accountID, payload.utxo, payload.network);
    }

    case ACTION_TYPES.DELETE_UTXO: {
      const accountID = payload.accountID as AccountID;
      if (!state.unspentsAndTransactions[accountID]) {
        return state;
      }

      const net = payload.network as NetworkString;

      const {
        [toStringOutpoint({ txid: payload.txid, vout: payload.vout })]: deleted,
        ...utxosMap
      } = state.unspentsAndTransactions[accountID][net].utxosMap;

      return {
        ...state,
        unspentsAndTransactions: {
          ...state.unspentsAndTransactions,
          [payload.accountID]: {
            ...state.unspentsAndTransactions[accountID],
            [net]: {
              ...state.unspentsAndTransactions[accountID][net],
              utxosMap,
            },
          },
        },
      };
    }

    case ACTION_TYPES.LOCK_UTXO: {
      const utxo = payload.utxo as UnblindedOutput;
      return {
        ...state,
        lockedUtxos: {
          ...state.lockedUtxos,
          [toStringOutpoint(utxo)]: Date.now(),
        },
      };
    }

    case ACTION_TYPES.UNLOCK_UTXOS: {
      const lockedUtxos = filterOnlyRecentLockedUtxos(state);
      return {
        ...state,
        lockedUtxos,
      };
    }

    case ACTION_TYPES.ADD_UNCONFIRMED_UTXOS: {
      const { unconfirmedUtxos, accountID, network } = payload;
      return addUnconfirmed(state)(unconfirmedUtxos, accountID, network);
    }

    case ACTION_TYPES.ADD_TX: {
      return addTx(state)(payload.accountID, payload.tx, payload.network);
    }

    case ACTION_TYPES.SET_DEEP_RESTORER_GAP_LIMIT: {
      return {
        ...state,
        deepRestorer: { ...state.deepRestorer, gapLimit: payload.gapLimit },
      };
    }

    case ACTION_TYPES.SET_DEEP_RESTORER_ERROR: {
      return {
        ...state,
        deepRestorer: { ...state.deepRestorer, error: payload.error },
      };
    }

    case ACTION_TYPES.FLUSH_UTXOS: {
      const accountID = payload.accountID as AccountID;
      const net = payload.network as NetworkString;
      return {
        ...state,
        unspentsAndTransactions: {
          ...state.unspentsAndTransactions,
          [accountID]: {
            ...state.unspentsAndTransactions[accountID],
            [net]: {
              ...state.unspentsAndTransactions[accountID][net],
              utxosMap: {},
            },
          },
        },
      };
    }

    case ACTION_TYPES.SET_VERIFIED: {
      return {
        ...state,
        isVerified: true,
      };
    }

    case ACTION_TYPES.PUSH_UPDATER_LOADER: {
      return {
        ...state,
        updaterLoaders: neverNegative(state.updaterLoaders + 1),
      };
    }

    case ACTION_TYPES.POP_UPDATER_LOADER: {
      return {
        ...state,
        updaterLoaders: neverNegative(state.updaterLoaders - 1),
      };
    }

    case ACTION_TYPES.PUSH_RESTORER_LOADER: {
      return {
        ...state,
        deepRestorer: {
          ...state.deepRestorer,
          restorerLoaders: neverNegative(state.deepRestorer.restorerLoaders + 1),
        },
      };
    }

    case ACTION_TYPES.POP_RESTORER_LOADER: {
      return {
        ...state,
        deepRestorer: {
          ...state.deepRestorer,
          restorerLoaders: neverNegative(state.deepRestorer.restorerLoaders - 1),
        },
      };
    }

    default: {
      return state;
    }
  }
}

const neverNegative = (n: number) => {
  if (n < 0) return 0;
  return n;
};

const increment = (n: number | undefined): number => {
  if (n === undefined || n === null) return 0;
  if (n < 0) return 1; // -Infinity = 0, return 0+1=1
  return n + 1;
};
