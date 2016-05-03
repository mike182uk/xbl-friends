import React from 'react'
import { connect } from 'react-redux'

import { loginRequested } from '../../actions/auth'

import FontAwesome from 'react-fontawesome'
import LoadingStateButton from '../../components/LoadingStateButton'

import styles from './style.css'

const Auth = class extends React.Component {
  render () {
    const { dispatch, actionInProgress } = this.props

    return (
      <div className={styles.auth} style={{ minHeight: window.innerHeight }}>
        <p className={`lead ${styles.login}`}><FontAwesome name='lock' /> Authentication Required</p>
        <p>You will need to sign in to your Xbox live account before you can use this app. Click the button below to authenticate. This should display the Microsoft Live account authentication screen in which you can sign in to your Xbox live account.</p>
        <LoadingStateButton
          onClick={() => dispatch(loginRequested())}
          isLoading={actionInProgress}
          loadingText='Authenticating...'
          bsStyle='primary'
          block={false}
        >Sign In To Xbox Live</LoadingStateButton>
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    actionInProgress: state.auth.actionInProgress
  }
}

export default connect(mapStateToProps)(Auth)
