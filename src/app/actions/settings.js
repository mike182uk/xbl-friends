export const SET_NOTIFICATION_PREFERENCE = 'SET_NOTIFICATION_PREFERENCE';
export const SET_BG_UPDATE_STATUS = 'SET_BG_UPDATE_STATUS';
export const SET_BG_UPDATE_INTERVAL = 'SET_BG_UPDATE_INTERVAL';

export function setNotificationPreference(preference) {
  return {
    type: SET_NOTIFICATION_PREFERENCE,
    preference
  }
}

export function setBgUpdateStatus(status) {
  return {
    type: SET_BG_UPDATE_STATUS,
    status
  }
}

export function setBgUpdateInterval(interval) {
  return {
    type: SET_BG_UPDATE_INTERVAL,
    interval
  }
}
