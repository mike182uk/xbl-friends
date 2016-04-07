import React from 'react';
import validator from 'validator';

import { Input } from 'react-bootstrap';
import LoadingStateButton from '../LoadingStateButton';

export default class CredentialsForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      usernameValid: null,
      passwordValid: null
    }
  }

  validateUsername(username) {
    let usernameValid = validator.isEmail(username);

    this.setState({ usernameValid });
  }

  validatePassword(password) {
    let passwordValid = ! validator.isNull(password);

    this.setState({ passwordValid });
  }

  submitCredentials() {
    let username = this.refs.username.getValue();
    let password = this.refs.password.getValue();

    this.validateUsername(username);
    this.validatePassword(password);

    if (this.state.usernameValid && this.state.passwordValid) {
      this.props.onSubmit(username, password);
    }
  }

  render() {
    return (
      <form>
        <Input
          type="email"
          ref="username"
          id="login_username"
          label="Xbox Live Email Address"
          bsStyle={this.state.usernameValid === false ? 'error' : null}
          onKeyUp={e => this.validateUsername.call(this, e.target.value)}
        />
        <Input
          type="password"
          ref="password"
          id="login_password"
          label="Xbox Live Password"
          bsStyle={this.state.passwordValid === false ? 'error' : null}
          onKeyUp={e => this.validatePassword.call(this, e.target.value)}
        />
        <LoadingStateButton
          onClick={this.submitCredentials.bind(this)}
          block={true}
          isLoading={this.props.authorizing}
          loadingText="Signing In..."
          bsStyle="primary"
        >Sign In</LoadingStateButton>
      </form>
    );
  }
}
