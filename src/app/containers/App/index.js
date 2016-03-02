import React from 'react';
import { connect } from 'react-redux';

import DevTools from '../../containers/DevTools';
import AppError from '../../components/AppError';
import AppMainNav from '../../components/AppMainNav';

import {
  AUTH as AUTH_ROUTE,
} from '../../constants/routes';

const App = class extends React.Component {
  getError() {
    if (this.props.error && this.props.showMainError) {
      return (
        <AppError message={this.props.error} />
      );
    }
  }

  getNav() {
    if (true) {//this.props.authorized) {
      return (
        <AppMainNav />
      )
    }
  }

  render() {
    return (
      <div className="container-fluid" style={{ minHeight: window.innerHeight }}>
        {this.getNav()}
        {this.getError()}
        {this.props.children}
        {<DevTools />}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    error: state.app.error,
    authorized: state.auth.authorized,
    // do not show the main error when on the auth route as the error is
    // shown inside of the auth container as it is centered on the page
    showMainError: state.routing.location.pathname.indexOf(AUTH_ROUTE) == -1
  }
}

export default connect(mapStateToProps)(App);
