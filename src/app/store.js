import { createStore, applyMiddleware, compose } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { hashHistory } from 'react-router'
import { syncHistory } from 'react-router-redux'
import * as storage from 'redux-storage'
import createEngine from 'redux-storage-engine-localstorage'
import filter from 'redux-storage-decorator-filter'
import ENV from './utils/env'

import reducers from './reducers'
import bgUpdateFriendsSubscriber from './subscribers/bg-update-friends'
import friendsOnlineNotificationSubscriber from './subscribers/friends-online-notification'

import {
  SET_NOTIFICATION_PREFERENCE,
  SET_BG_UPDATE_STATUS,
  SET_BG_UPDATE_INTERVAL
} from './actions/settings'

import {
  STATE_STORAGE_KEY
} from './constants/app'

import DevTools from './containers/DevTools'

// init storage
const finalReducer = storage.reducer(reducers)
const storageEngine = filter(
  createEngine(STATE_STORAGE_KEY),
  ['settings']
)
const storageMiddleware = storage.createMiddleware(storageEngine, [], [
  SET_NOTIFICATION_PREFERENCE,
  SET_BG_UPDATE_STATUS,
  SET_BG_UPDATE_INTERVAL
])

// create store
const reduxRouterMiddleware = syncHistory(hashHistory)

const storeEnhancers = [
  applyMiddleware(thunkMiddleware, reduxRouterMiddleware, storageMiddleware)
]

if (ENV === 'dev') {
  storeEnhancers.push(DevTools.instrument())
}

const createStoreWithEnhancers = compose.apply(null, storeEnhancers)(createStore)

const store = createStoreWithEnhancers(finalReducer)

// init redux router middleware
reduxRouterMiddleware.listenForReplays(store);

// init subscribers
[bgUpdateFriendsSubscriber, friendsOnlineNotificationSubscriber].map(subscriber => subscriber(store))

// load saved state
const loadSavedState = storage.createLoader(storageEngine)
loadSavedState(store)

// export store
export default store
