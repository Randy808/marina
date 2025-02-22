// Wallet
export const SET_MNEMONIC = 'SET_MNEMONIC';
export const SET_ACCOUNT_DATA = 'SET_ACCOUNT_DATA';
export const SET_CS_ACCOUNT_TEMPLATE = 'SET_CUSTOM_SCRIPT_ACCOUNT_TEMPLATE';
export const SET_CS_ACCOUNT_IS_SPENDABLE_BY_MARINA =
  'SET_CUSTOM_SCRIPT_ACCOUNT_IS_SPENDABLE_BY_MARINA';
export const CREATE_ACCOUNT = 'CREATE_ACCOUNT';
export const SET_RESTORER_OPTS = 'SET_RESTORER_OPTS';
export const ADD_UTXO = 'ADD_UTXO';
export const DELETE_UTXO = 'DELETE_UTXO';
export const FLUSH_UTXOS = 'FLUSH_UTXOS';
export const SET_DEEP_RESTORER_GAP_LIMIT = 'SET_DEEP_RESTORER_GAP_LIMIT';
export const SET_DEEP_RESTORER_ERROR = 'SET_DEEP_RESTORER_ERROR';
export const INCREMENT_EXTERNAL_ADDRESS_INDEX = 'INCREMENT_EXTERNAL_ADDRESS_INDEX';
export const INCREMENT_INTERNAL_ADDRESS_INDEX = 'INCREMENT_INTERNAL_ADDRESS_INDEX';
export const SET_VERIFIED = 'SET_VERIFIED';
export const RESET_WALLET = 'RESET_WALLET';
export const POP_UPDATER_LOADER = 'POP_UPDATER_LOADER';
export const PUSH_UPDATER_LOADER = 'PUSH_UPDATER_LOADER';
export const LOCK_UTXO = 'LOCK_UTXO';
export const UNLOCK_UTXOS = 'UNLOCK_UTXOS';
export const ADD_UNCONFIRMED_UTXOS = 'ADD_UNCONFIRMED_UTXOS';
export const POP_RESTORER_LOADER = 'POP_RESTORER_LOADER';
export const PUSH_RESTORER_LOADER = 'PUSH_RESTORER_LOADER';

// App
export const AUTHENTICATION_SUCCESS = 'AUTHENTICATION_SUCCESS';
export const AUTHENTICATION_FAILURE = 'AUTHENTICATION_FAILURE';
export const ONBOARDING_COMPLETETED = 'ONBOARDING_COMPLETETED';
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';
export const CHANGE_NETWORK_SUCCESS = 'CHANGE_NETWORK_SUCCESS';
export const SET_EXPLORER = 'SET_EXPLORER';
export const RESET_APP = 'RESET_APP';
export const SET_CHANGE_ACCOUNT = 'SET_CHANGE_ACCOUNT';

// Onboarding
export const ONBOARDING_SET_MNEMONIC_AND_PASSWORD = 'ONBOARDING_SET_MNEMONIC_AND_PASSWORD';
export const ONBOARDING_FLUSH = 'ONBOARDING_FLUSH';
export const ONBOARDING_SET_IS_FROM_POPUP_FLOW = 'ONBOARDING_SET_IS_FROM_POPUP_FLOW';
export const ONBOARDING_SET_VERIFIED = 'ONBOARDING_SET_VERIFIED';

// Transactions history
export const ADD_TX = 'ADD_TX';

// Pending transaction
export const PENDING_TX_SET_STEP = 'PENDING_TX_SET_STEP';
export const PENDING_TX_SET_ASSET = 'PENDING_TX_SET_ASSET';
export const PENDING_TX_SET_ADDRESSES_AND_AMOUNT = 'PENDING_TX_SET_ADDRESSES_AND_AMOUNT';
export const PENDING_TX_SET_FEE_CHANGE_ADDRESS = 'PENDING_TX_SET_FEE_CHANGE_ADDRESS';
export const PENDING_TX_SET_FEE_AMOUNT_AND_ASSET = 'PENDING_TX_SET_FEE_AMOUNT_AND_ASSET';
export const PENDING_TX_FLUSH = 'PENDING_TX_FLUSH';
export const PENDING_TX_SET_PSET = 'PENDING_TX_SET_PSET';

// Assets
export const ADD_ASSET = 'ADD_ASSET';

// Connect data
export const ENABLE_WEBSITE = 'ENABLE_WEBSITE';
export const DISABLE_WEBSITE = 'DISABLE_WEBSITE';
export const SET_TX_DATA = 'SET_TX_DATA';
export const SET_CREATE_ACCOUNT_DATA = 'SET_CREATE_ACCOUNT_DATA';
export const FLUSH_TX = 'FLUSH_TX';
export const SET_MSG = 'SET_MSG';
export const FLUSH_MSG = 'FLUSH_MSG';
export const SELECT_HOSTNAME = 'SELECT_HOSTNAME';
export const FLUSH_SELECTED_HOSTNAME = 'FLUSH_SELECTED_HOSTNAME';
export const SET_APPROVE_REQUEST_PARAM = 'SET_APPROVE_REQUEST_PARAM';
export const RESET_CONNECT = 'RESET_CONNECT';

// Taxi
export const SET_TAXI_ASSETS = 'SET_TAXI_ASSETS';
export const UPDATE_TAXI_ASSETS = 'UPDATE_TAXI_ASSETS';
export const RESET_TAXI = 'RESET_TAXI';

// Reset
export const RESET = 'RESET';

// Background async task
export const UPDATE_TASK = 'UPDATE_TASK';
export const RESTORE_TASK = 'RESTORE_TASK';
