import React from 'react';

import { validateAuthCode } from '../../utils/validators';

import { Button, ButtonToolbar, Input } from 'react-bootstrap';
import LoadingStateButton from '../LoadingStateButton';

export default class AuthCodeForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      authCodeValid: null
    }
  }

  validateAuthCode(authCode) {
    let authCodeValid = validateAuthCode(authCode);

    this.setState({ authCodeValid });
  }

  submitAuthCode() {
    let authCode = this.refs.authCode.getValue();

    this.validateAuthCode(authCode);

    if (this.state.authCodeValid) {
      this.props.onSubmit(authCode);
    }
  }

  cancelAuthCodeSubmission() {
    this.props.onCancelAuthCodeSubmission();
  }

  render() {
    return (
      <form>
        <p className="alert alert-info">You have 2 factor authentication enabled on your Xbox Live account. We will need a valid auth code to sign you in.</p>
        <Input
          type="text"
          ref="authCode"
          id="login_auth_code"
          label="Auth Code"
          bsStyle={this.state.authCodeValid === false ? 'error' : null}
          onKeyUp={e => this.validateAuthCode.call(this, e.value)}
        />
        <ButtonToolbar>
          <LoadingStateButton
            onClick={this.submitAuthCode.bind(this)}
            block={true}
            isLoading={this.props.verifying}
            loadingText="Verifying Auth Code..."
            bsStyle="primary"
          >Verify Auth Code
          </LoadingStateButton>
          <Button onClick={this.cancelAuthCodeSubmission.bind(this)} disabled={this.props.verifying} block>
            Cancel
          </Button>
        </ButtonToolbar>
      </form>
    );
  }
}
