import React from 'react'
import { connect } from 'react-redux'

import SettingsForm from '../../components/SettingsForm'

import {
  setNotificationPreference,
  setBgUpdateStatus,
  setBgUpdateInterval
} from '../../actions/settings'

import { logoutRequested } from '../../actions/auth'

const Settings = class extends React.Component {
  render () {
    const { dispatch, settings, actionInProgress } = this.props

    return (
      <div>
        <SettingsForm
          settings={settings}
          onChangeNotificationPreference={preference =>
            dispatch(setNotificationPreference(preference))
          }
          onChangeBgUpdateStatus={status =>
            dispatch(setBgUpdateStatus(Boolean(Number(status))))
          }
          onChangeBgUpdateInterval={interval =>
            dispatch(setBgUpdateInterval(interval))
          }
          onSignOut={() => dispatch(logoutRequested())}
          signingOut={actionInProgress}
        />
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    settings: state.settings,
    actionInProgress: state.auth.actionInProgress
  }
}

export default connect(mapStateToProps)(Settings)
