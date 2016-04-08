import React from 'react';
import { connect } from 'react-redux';

import { loginRequested } from '../../actions/auth';

import LoadingStateButton from '../../components/LoadingStateButton';

import styles from './style.css';

const Auth = class extends React.Component {
  render() {
    const { dispatch, actionInProgress } = this.props;

    return (
      <div className={styles.auth} style={{ minHeight: window.innerHeight }}>
        <p className={`lead ${styles.login}`}>You first need to sign in to your Xbox Live account.</p>
        <LoadingStateButton
          onClick={() => dispatch(loginRequested())}
          isLoading={actionInProgress}
          loadingText="Authenticating..."
          bsStyle="primary"
          block={false}
        >Sign In To Xbox Live</LoadingStateButton>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    actionInProgress: state.auth.actionInProgress
  }
}

export default connect(mapStateToProps)(Auth);
