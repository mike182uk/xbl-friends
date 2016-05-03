module.exports = {
  // window IDs
  WINDOW_ID_APP: 'app',
  WINDOW_ID_XBL: 'xbl',

  // IPC channels
  IPC_CHANNEL_MAIN: 'main',
  IPC_CHANNEL_XBL_WINDOW: 'xbl',

  // IPC message types
  IPC_MESSAGE_TYPE_XBL_WINDOW_EVENT: 'event',
  IPC_MESSAGE_TYPE_XBL_WINDOW_ACTION: 'action',

  // XBL window events
  XBL_WINDOW_EVENT_LOGGED_IN: 'logged-in',
  XBL_WINDOW_EVENT_LOGGED_OUT: 'logged-out',
  XBL_WINDOW_EVENT_FRIENDS_RETRIEVED: 'friends-retrieved',
  XBL_WINDOW_EVENT_WINDOW_DISPLAYED: 'window-displayed',
  XBL_WINDOW_EVENT_INITIAL_LOAD_COMPLETE: 'initial-load-complete',
  XBL_WINDOW_EVENT_AUTH_CANCELLED: 'auth-cancelled',

  // XBL window actions
  XBL_WINDOW_ACTION_LOGIN: 'login',
  XBL_WINDOW_ACTION_LOGOUT: 'logout',
  XBL_WINDOW_ACTION_RETRIEVE_FRIENDS: 'retrieve-friends',

  // URLs
  URL_FRIENDS: 'https://account.xbox.com/en-US/Friends'
}
