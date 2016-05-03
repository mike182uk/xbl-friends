import React from 'react'

import { Input } from 'react-bootstrap'
import LoadingStateButton from '../LoadingStateButton'

import {
  NOTIFICATION_PREFERENCE_FRIEND_ONLY,
  NOTIFICATION_PREFERENCE_FAVOURITE_ONLY,
  NOTIFICATION_PREFERENCE_NON,
  BG_UPDATE_ENABLED,
  BG_UPDATE_DISABLED,
  BG_UPDATE_INTERVAL_5,
  BG_UPDATE_INTERVAL_10,
  BG_UPDATE_INTERVAL_15,
  BG_UPDATE_INTERVAL_30,
  BG_UPDATE_INTERVAL_60
} from '../../constants/settings'

export default class SettingsForm extends React.Component {
  getNotificationPreferenceOptions () {
    return {
      [NOTIFICATION_PREFERENCE_FRIEND_ONLY]: 'Show a notification when a friend comes online',
      [NOTIFICATION_PREFERENCE_FAVOURITE_ONLY]: 'Show a notification when a favourite friend comes online',
      [NOTIFICATION_PREFERENCE_NON]: 'Do not show any notifications'
    }
  }

  getBgUpdateIntervalOptions () {
    return {
      [BG_UPDATE_INTERVAL_5]: 'Every 5 Minutes',
      [BG_UPDATE_INTERVAL_10]: 'Every 10 Minutes',
      [BG_UPDATE_INTERVAL_15]: 'Every 15 Minutes',
      [BG_UPDATE_INTERVAL_30]: 'Every 30 Minutes',
      [BG_UPDATE_INTERVAL_60]: 'Every 60 Minutes'
    }
  }

  render () {
    const {
      settings,
      onChangeNotificationPreference,
      onChangeBgUpdateStatus,
      onChangeBgUpdateInterval,
      onSignOut,
      signingOut
    } = this.props

    const notificationPreferencesOptions = this.getNotificationPreferenceOptions()
    const updateIntervalOptions = this.getBgUpdateIntervalOptions()

    return (
      <form>
        <Input
          type='select'
          id='settings_notification_preference'
          onChange={e => onChangeNotificationPreference(e.target.value)}
          value={settings.notifications.preference}
          label='Notification Preference'
        >
          {Object.keys(notificationPreferencesOptions).map((key, index) =>
            <option key={index} value={key}>{notificationPreferencesOptions[key]}</option>
          )}
        </Input>
        <Input
          type='select'
          id='settings_friends_bg_update_status'
          onChange={e => onChangeBgUpdateStatus(e.target.value)}
          value={Number(settings.friends.bgUpdate)}
          label='Friends Background Update'
        >
          <option value={Number(BG_UPDATE_ENABLED)}>Enabled</option>
          <option value={Number(BG_UPDATE_DISABLED)}>Disabled</option>
        </Input>
        <Input
          type='select'
          id='settings_friends_bg_update_interval'
          onChange={e => onChangeBgUpdateInterval(e.target.value)}
          value={settings.friends.bgUpdateInterval}
          label='Friends Background Update Interval'
          disabled={!settings.friends.bgUpdate}
        >
          {Object.keys(updateIntervalOptions).map((key, index) =>
            <option key={index} value={key}>{updateIntervalOptions[key]}</option>
          )}
        </Input>
        <LoadingStateButton
          onClick={() => onSignOut()}
          isLoading={signingOut}
          loadingText='Signing Out Of Xbox Live...'
          bsStyle='danger'
          block
        >Sign Out Of Xbox Live</LoadingStateButton>
      </form>
    )
  }
}
