window.requireNode = window.require;
window.require = undefined;

var constants = requireNode(__dirname + '/../../common/constants');
var ipcRenderer = requireNode('electron').ipcRenderer;

ipcRenderer.on(constants.IPC_CHANNEL_RPC_REQ, function(event, message) {
  switch(message.action) {
    case constants.IPC_RPC_LOGIN:
      login(message.data.username, message.data.password);
      break;
    case constants.IPC_RPC_VERIFY_AUTH_CODE:
      verifyAuthCode(message.data.authCode);
      break;
    case constants.IPC_RPC_GET_FRIENDS:
      getFriends()
      break;
  }
});

function sendXblWindowRpcRes(action, data) {
  ipcRenderer.send(constants.IPC_CHANNEL_XBL_WINDOW_RPC, {
    type: constants.IPC_MESSAGE_TYPE_RES,
    action: action,
    data: data
  });
}

function login(username, password) {
  var emailInput = document.querySelector('[name=loginfmt]');
  var passwordInput = document.querySelector('[name=passwd]');
  var keepMeSignedInCheckbox = document.querySelector('[name=KMSI]');
  var signInButton = document.querySelector('[name=SI]');

  emailInput.value = username;
  passwordInput.value = password;
  keepMeSignedInCheckbox.checked = true;
  signInButton.click();
}

function verifyAuthCode(authCode) {
  var oneTimeCodeInput = document.querySelector('[name=otc]');
  var dontAskForCode = document.querySelector('[name=AddTD]');
  var submitButton = document.querySelector('input[type=submit][value=Submit]');

  oneTimeCodeInput.value = authCode;
  dontAskForCode.checked = true;
  submitButton.click();
}

function getFriends() {
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

  sendXblWindowRpcRes(constants.IPC_RPC_GET_FRIENDS, data);
}

window.addEventListener('load', function() {
  // If login page
  if (typeof evt_Login_onload == 'function') {
    var old_evt_Login_onload = evt_Login_onload;

    evt_Login_onload = function() {
      old_evt_Login_onload(arguments);

      var lockoutError = document.querySelector('#idTD_LockoutError');
      var loginError = document.querySelector('#idTd_Tile_ErrorMsg_Login');

      if (lockoutError || loginError && loginError.innerHTML != '') {
        sendXblWindowRpcRes(constants.IPC_RPC_LOGIN, { status: false });
      }
    }
  }

  // If 2FA page
  if (typeof evt_SA_onload == 'function') {
    var old_evt_SA_onload = evt_SA_onload;

    evt_SA_onload = function() {
      old_evt_SA_onload(arguments);

      var oneTimeCodeInputError = document.querySelector('#idSpan_SAOTCC_Error_OTC');

      if (oneTimeCodeInputError && oneTimeCodeInputError.innerHTML != '') {
        sendXblWindowRpcRes(constants.IPC_RPC_VERIFY_AUTH_CODE, { status: false });
      } else {
        sendXblWindowRpcRes(constants.IPC_RPC_LOGIN, { status: true, authCodeRequired: true });
      }
    }
  }

  // If friends page
  if (window.location.href.indexOf(constants.URL_FRIENDS) >= 0) {
    // send login & verifyAuthCode message in case there are any listeners listening
    // on these channels
    sendXblWindowRpcRes(constants.IPC_RPC_LOGIN, { status: true });
    sendXblWindowRpcRes(constants.IPC_RPC_VERIFY_AUTH_CODE, { status: true });
  }
});
