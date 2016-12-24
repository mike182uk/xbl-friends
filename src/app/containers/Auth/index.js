import React from 'react'
import { connect } from 'react-redux'

import { loginRequested } from '../../actions/auth'

import FontAwesome from 'react-fontawesome'
import LoadingStateButton from '../../components/LoadingStateButton'

import styles from './styles.css'

const Auth = class extends React.Component {
  render () {
    const { dispatch, actionInProgress } = this.props

    return (
      <div className={styles.auth}>
        <p className={`lead ${styles.login}`}><FontAwesome name='lock' /> Authentication Required</p>
        <p>Sign in to your Xbox live account to use this app.</p>
        <br />
        <LoadingStateButton
          onClick={() => dispatch(loginRequested())}
          isLoading={actionInProgress}
          loadingText='Authenticating...'
          bsStyle='success'
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
