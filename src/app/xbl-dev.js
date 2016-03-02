export function init() {
  return Promise.resolve(false);
}

export function login(username, password) {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve({ authCodeRequired: true }), 1000);
    //setTimeout(() => reject('There was a problem signing you into your Xbox Live account.'), 1000);
  });
}

export function verifyAuthCode(authCode) {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(), 1000);
    //setTimeout(() => reject('There was a problem verifying the auth code.'), 1000);
  });
}

export function logout() {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(), 1000);
    //setTimeout(() => reject('There was a problem signing you out of your Xbox Live account.'), 1000);
  });
}

export function fetchFriends() {
  return new Promise((resolve, reject) => {
    const friends = [
      {
        gamertag: 'foo',
        favourite: true,
        online: true,
        realname: 'Foo Foo',
        primaryInfo: 'Last online 2 hours ago',
        secondaryInfo: 'Playing Fallout 4',
        gamerpic: 'http://placehold.it/80'
      },
      {
        gamertag: 'bar',
        favourite: false,
        online: false,
        realname: 'Bar Bar',
        primaryInfo: 'Last online 2 hours ago',
        secondaryInfo: '',
        gamerpic: 'http://placehold.it/80'
      },
      {
        gamertag: 'foo',
        favourite: false,
        online: false,
        realname: '',
        primaryInfo: 'Last online 2 hours ago',
        secondaryInfo: '',
        gamerpic: 'http://placehold.it/80'
      }
    ];

    setTimeout(() => resolve(friends), 1000);
    //setTimeout(() => reject('There was a problem updating your friends list.'), 1000);
  });
}
