import { friendsRetrievalRequested } from '../actions/friends'

export default function (store) {
  let bgUpdate = false
  let currentBgUpdateInterval
  let bgUpdateTimer

  const bgUpdateFriendsHandler = () => {
    let state = store.getState()

    // not logged in
    if (!state.auth.authorized && !bgUpdateTimer) {
      return
    }

    // logged out
    if (!state.auth.authorized) {
      return clearBgUpdateState()
    }

    // disabled bg update
    if (bgUpdate && !state.settings.friends.bgUpdate) {
      return clearBgUpdateState()
    }

    // bgUpdateInterval changed
    if (currentBgUpdateInterval && currentBgUpdateInterval !== state.settings.friends.bgUpdateInterval) {
      clearBgUpdateState()
    }

    // setup bgUpdate timer
    if (!bgUpdateTimer && state.settings.friends.bgUpdate) {
      bgUpdateTimer = setInterval(() => {
        if (!state.friends.updateInProgress) {
          store.dispatch(friendsRetrievalRequested(true))
        }
      }, state.settings.friends.bgUpdateInterval)

      bgUpdate = true
      currentBgUpdateInterval = state.settings.friends.bgUpdateInterval
    }
  }

  function clearBgUpdateState () {
    bgUpdate = false
    currentBgUpdateInterval = null
    clearInterval(bgUpdateTimer)
    bgUpdateTimer = null
  }

  return store.subscribe(bgUpdateFriendsHandler)
}
