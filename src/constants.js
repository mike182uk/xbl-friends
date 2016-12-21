module.exports = {
  // window IDs
  WINDOW_ID_APP: 'app',
  WINDOW_ID_XBL: 'xbl',

  // IPC channels
  IPC_CHANNEL_MAIN: 'main',
  IPC_CHANNEL_XBL_WINDOW: 'xbl',

  // IPC message types
  IPC_MESSAGE_TYPE_XBL_WINDOW_EVENT: 'xbl-window-event',
  IPC_MESSAGE_TYPE_XBL_WINDOW_ACTION: 'xbl-window-action',
  IPC_MESSAGE_TYPE_APP_WINDOW_ACTION: 'app-window-action',

  // XBL window events
  XBL_WINDOW_EVENT_INITIALISED: 'xbl-window-event-initialised',
  XBL_WINDOW_EVENT_LOGGED_IN: 'xbl-window-event-logged-in',
  XBL_WINDOW_EVENT_LOGGED_OUT: 'xbl-window-event-logged-out',
  XBL_WINDOW_EVENT_FRIENDS_RETRIEVED: 'xbl-window-event-friends-retrieved',
  XBL_WINDOW_EVENT_WINDOW_CLOSED: 'xbl-window-event-closed',

  // App window events
  APP_WINDOW_EVENT_INITIALISING: 'app-window-event-initialising',

  // XBL window actions
  XBL_WINDOW_ACTION_LOGIN: 'xbl-window-action-login',
  XBL_WINDOW_ACTION_LOGOUT: 'xbl-window-action-logout',
  XBL_WINDOW_ACTION_RETRIEVE_FRIENDS: 'xbl-window-action-retrieve-friends',

  // URLs
  URL_FRIENDS: 'https://account.xbox.com/en-US/Friends'
}
