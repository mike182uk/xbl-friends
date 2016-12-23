/* global Notification, Audio */

import _ from 'lodash'

import { NOTIFICATION_PREFERENCE_FAVOURITE_ONLY, NOTIFICATION_PREFERENCE_FRIEND_ONLY, NOTIFICATION_PREFERENCE_NON } from '../constants/settings'

import notificationSoundPath from '../../electron/notification.mp3'

export default function (store) {
  let friendsNotifiedFor = []
  let firstRun = true
  let currentNotificationsPreference = store.getState().settings.notifications.preference

  const notifyFriendsOnlineHandler = () => {
    let state = store.getState()
    let notificationsPreference = state.settings.notifications.preference

    // dont send any notifications on the first load of the app
    if (state.friends.lastUpdatedAt === null) {
      return
    }

    // if the user has changed thier notifications preference then reset everything.
    // this is too prevent notifications being sent as soon as the user changes there preference.
    if (!firstRun && currentNotificationsPreference !== notificationsPreference) {
      currentNotificationsPreference = notificationsPreference
      friendsNotifiedFor = []
      firstRun = true
      return
    }

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

    // no friends :(
    if (!state.friends.friends.length) {
      friendsNotifiedFor = []
      return
    }

    let newFriendsToNotifyFor = getOnlineFriendsForNotificationsPreference(
      state.friends.friends,
      notificationsPreference
    )

    let newFriendsToNotifyForMap = newFriendsToNotifyFor.map(friend => friend.gamertag)

    // not first run and newFriendsToNotifyFor differ
    if (!firstRun && !_.isEqual(newFriendsToNotifyForMap, friendsNotifiedFor)) {
      let notificationStepTimer = 0

      _.difference(newFriendsToNotifyForMap, friendsNotifiedFor).forEach(gamertag => {
        setTimeout(() => {
          notify(
            _.find(newFriendsToNotifyFor, { gamertag: gamertag })
          )
        }, notificationStepTimer)

        // step the timeout so lots of notifications do not come in at once
        notificationStepTimer += 2500
      })
    }

    friendsNotifiedFor = newFriendsToNotifyForMap
    firstRun = false
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
  (new Audio(notificationSoundPath)).play()

  return new Notification('Friend Online', {
    body: `${friend.gamertag} is online - ${friend.primaryInfo}`,
    icon: friend.gamerpic,
    silent: true
  })
}
