window.requireNode = window.require;
window.require = undefined;

var constants = requireNode(__dirname + '/../../common/constants');
var ipcRenderer = requireNode('electron').ipcRenderer;

ipcRenderer.on(constants.IPC_CHANNEL_XBL_WINDOW, function(event, message) {
  if (message.type == constants.IPC_MESSAGE_TYPE_XBL_WINDOW_ACTION) {
    switch (message.action) {
      case constants.XBL_WINDOW_ACTION_RETRIEVE_FRIENDS:
        retrieveFriends();
        break;
    }
  }
});

function retrieveFriends() {
  var friends = document.querySelectorAll('[data-gamertag]');
  friends = Array.prototype.slice.call(friends);

  friends = friends.filter(function(friend){
    return friend.getAttribute('data-isfriend') == 'True';
  });

  var data = [];
  var friendsAdded = [];

  friends.forEach(function(friend) {
    if (!friendsAdded.includes(friend.getAttribute('data-gamertag'))) {
      data.push({
        gamertag: friend.getAttribute('data-gamertag'),
        favourite: friend.getAttribute('data-isfavorite') == 'True',
        online: friend.getAttribute('data-isonline') == 'True',
        realname: friend.querySelector('.realName').innerHTML,
        primaryInfo: friend.querySelector('.primaryInfo').innerHTML,
        secondaryInfo: friend.querySelector('.secondaryInfo').innerHTML,
        gamerpic: friend.querySelector('.gamerpic').src
      });

      friendsAdded.push(friend.getAttribute('data-gamertag'));
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
