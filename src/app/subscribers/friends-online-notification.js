/* global Notification */

import _ from 'lodash'

import { NOTIFICATION_PREFERENCE_FAVOURITE_ONLY, NOTIFICATION_PREFERENCE_FRIEND_ONLY, NOTIFICATION_PREFERENCE_NON } from '../constants/settings'

export default function (store) {
  let friendsNotifiedFor = []

  const notifyFriendsOnlineHandler = () => {
    let state = store.getState()
    let notificationsPreference = state.settings.notifications.preference

    // not logged in
    if (!state.auth.authorized && !friendsNotifiedFor.length) {
      return
    }

    // logged out
    if (!state.auth.authorized) {
      friendsNotifiedFor = []
      return
    }

    // notification disabled
    if (notificationsPreference === NOTIFICATION_PREFERENCE_NON) {
      friendsNotifiedFor = []
      return
    }

    const newFriendsToNotifyFor = getOnlineFriendsForNotificationsPreference(
      state.friends.friends,
      notificationsPreference
    )

    // not first run and newFriendsToNotifyFor differ
    let newFriendsMap = newFriendsToNotifyFor.map(friend => friend.gamertag)

    if (friendsNotifiedFor.length && !_.isEqual(newFriendsMap, friendsNotifiedFor)) {
      _.difference(newFriendsMap, friendsNotifiedFor).forEach(friend =>
        notify(
          _.find(newFriendsToNotifyFor, { gamertag: friend })
        ))
    }

    friendsNotifiedFor = newFriendsMap
  }

  return store.subscribe(notifyFriendsOnlineHandler)
}

function getOnlineFriendsForNotificationsPreference (friends, notificationsPreference) {
  return friends.filter(friend => {
    if (friend.online) {
      if (notificationsPreference === NOTIFICATION_PREFERENCE_FAVOURITE_ONLY && friend.favourite) {
        return friend
      }

      if (notificationsPreference === NOTIFICATION_PREFERENCE_FRIEND_ONLY) {
        return friend
      }
    }
  })
}

function notify (friend) {
  return new Notification('Friend Online', {
    body: `${friend.gamertag} is online - ${friend.primaryInfo}`,
    icon: friend.gamerpic
  })
}
