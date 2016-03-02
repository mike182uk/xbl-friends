module.exports = {
  // window IDs
  WINDOW_ID_APP: 'app',
  WINDOW_ID_XBL: 'xbl',

  // Xbox Live window commands
  XBL_WINDOW_CMD_CLEAR_STORAGE: 'clear-storage',
  XBL_WINDOW_CMD_NAVIGATE: 'navigate-and-wait-for-dom',

  // IPC channels
  IPC_CHANNEL_XBL_WINDOW_RPC: 'xbl-window-rpc',
  IPC_CHANNEL_XBL_WINDOW: 'xbl-window',
  IPC_CHANNEL_XBL_WINDOW_RES: 'xbl-window-res',
  IPC_CHANNEL_RPC_REQ: 'rpc-req',
  IPC_CHANNEL_RPC_RES: 'rpc-res',

  // IPC message types
  IPC_MESSAGE_TYPE_REQ: 'req',
  IPC_MESSAGE_TYPE_RES: 'res',

  // IPC RPC actions
  IPC_RPC_LOGIN: 'login',
  IPC_RPC_VERIFY_AUTH_CODE: 'verifyAuthCode',
  IPC_RPC_GET_FRIENDS: 'getFriends',

  // URLs
  URL_FRIENDS: 'https://account.xbox.com/en-US/Friends',
  URL_LOGOUT: 'https://account.xbox.com/Account/Signout?returnUrl=https://account.xbox.com/en-US/Friends'
}
