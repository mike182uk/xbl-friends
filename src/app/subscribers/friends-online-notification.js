import difference from 'lodash/difference';

import {
  NOTIFICATION_PREFERENCE_FAVOURITE_ONLY,
  NOTIFICATION_PREFERENCE_FRIEND_ONLY,
  NOTIFICATION_PREFERENCE_NON
} from '../constants/settings';

export default function (store) {
  let friendsNotifiedFor = [];

  const notifyFriendsOnlineHandler = () => {
    let state = store.getState();
    let notificationsPreference = state.settings.notifications.preference;

    // not logged in
    if (!state.auth.authorized && !friendsNotifiedFor.length) {
      return;
    }

    // logged out
    if (!state.auth.authorized) {
      friendsNotifiedFor = [];
      return;
    }

    // notification disabled
    if (notificationsPreference == NOTIFICATION_PREFERENCE_NON) {
      friendsNotifiedFor = [];
      return;
    }

    const newFriendsToNotifyFor = getOnlineFriendsForNotificationsPreference(
      state.friends.friends,
      notificationsPreference
    );

    // not first run and newFriendsToNotifyFor differ
    if (friendsNotifiedFor.length && friendsNotifiedFor !== newFriendsToNotifyFor) {
      difference(newFriendsToNotifyFor, friendsNotifiedFor).forEach(friend => notify(friend));
    }

    friendsNotifiedFor = newFriendsToNotifyFor;
  }

  return store.subscribe(notifyFriendsOnlineHandler);
}

function getOnlineFriendsForNotificationsPreference(friends, notificationsPreference) {
  return friends.filter(friend => {
    if (friend.online) {
      if (notificationsPreference == NOTIFICATION_PREFERENCE_FAVOURITE_ONLY && friend.favourite) {
        return friend;
      }

      if (notificationsPreference == NOTIFICATION_PREFERENCE_FRIEND_ONLY) {
        return friend;
      }
    }
  });
}

function notify(friend) {
  return new Notification(`Friend Online`, {
    body: `${friend.gamertag} is online - ${friend.primaryInfo}`,
    icon: friend.gamerpic
  });
}
