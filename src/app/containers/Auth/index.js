import React from 'react';
import { connect } from 'react-redux';

import {
  cancelAuthCodeSubmission,
  loginToXBL,
  verifyXBLAuthCode
} from '../../actions/auth';

import AppError from '../../components/AppError';
import AuthCodeForm from '../../components/AuthCodeForm';
import CredentialsForm from '../../components/CredentialsForm';

import styles from './style.css';

const Auth = class extends React.Component {
  getError() {
    if (this.props.error) {
      return (
        <AppError message={this.props.error} />
      );
    }
  }

  getForm() {
    return this.props.authCodeRequired ?
      this.getAuthcodeForm() :
      this.getCredentialsForm();
  }

  getAuthcodeForm() {
    return (
      <AuthCodeForm
        onSubmit={authCode => this.props.dispatch(verifyXBLAuthCode(authCode))}
        onCancelAuthCodeSubmission={() => this.props.dispatch(cancelAuthCodeSubmission())}
        verifying={this.props.actionInProgress}
      />
    );
  }

  getCredentialsForm(){
    return (
      <CredentialsForm
        onSubmit={(username, password) =>
          this.props.dispatch(loginToXBL(username, password))
        }
        authorizing={this.props.actionInProgress}
      />
    );
  }

  render() {
    return (
      <div className={styles.auth} style={{ minHeight: window.innerHeight }}>
        {this.getError()}
        {this.getForm()}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    error: state.app.error,
    authCodeRequired: state.auth.authCodeRequired,
    actionInProgress: state.auth.actionInProgress
  }
}

export default connect(mapStateToProps)(Auth);
