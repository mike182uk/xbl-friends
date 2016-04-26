'use strict';

const nodeRequire = require;

delete window.require;

const _ = nodeRequire('lodash');
const ipcRenderer = nodeRequire('electron').ipcRenderer;
const constants = nodeRequire('../../common/constants');

const retrieveFriends = () => {
  let data = [];
  let friends = Array.from(document.querySelectorAll('[data-gamertag]'))
    .filter(friend => friend.getAttribute('data-isfriend') == 'True');

  friends.forEach(friend => {
    if (!_.find(data, { gamertag: friend.getAttribute('data-gamertag') })) {
      data.push({
        gamertag: friend.getAttribute('data-gamertag'),
        favourite: friend.getAttribute('data-isfavorite') == 'True',
        online: friend.getAttribute('data-isonline') == 'True',
        realname: friend.querySelector('.realName').innerHTML,
        primaryInfo: friend.querySelector('.primaryInfo').innerHTML,
        secondaryInfo: friend.querySelector('.secondaryInfo').innerHTML,
        gamerpic: friend.querySelector('.gamerpic').src
      });
    }
  });

  ipcRenderer.send(constants.IPC_CHANNEL_XBL_WINDOW, {
    type: constants.IPC_MESSAGE_TYPE_XBL_WINDOW_EVENT,
    event: constants.XBL_WINDOW_EVENT_FRIENDS_RETRIEVED,
    data: {
      friends: data
    }
  });
}

ipcRenderer.on(constants.IPC_CHANNEL_XBL_WINDOW, (event, message) => {
  if (message.type == constants.IPC_MESSAGE_TYPE_XBL_WINDOW_ACTION) {
    switch (message.action) {
      case constants.XBL_WINDOW_ACTION_RETRIEVE_FRIENDS:
        retrieveFriends();
        break;
    }
  }
});
