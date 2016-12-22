import React from 'react'
import { connect } from 'react-redux'

import DevTools from '../../containers/DevTools'
import AppError from '../../components/AppError'
import AppMainNav from '../../components/AppMainNav'

import {
  AUTH as AUTH_ROUTE
} from '../../constants/routes'

import styles from './styles.css'

const App = class extends React.Component {
  getError () {
    if (this.props.error && this.props.showMainError) {
      return (
        <AppError message={this.props.error} />
      )
    }
  }

  getNav () {
    if (this.props.authorized || __DEV__) {
      return (
        <AppMainNav />
      )
    }
  }

  getDevTools () {
    if (__DEV__) {
      return (
        <DevTools />
      )
    }
  }

  render () {
    return (
      <div className={`container-fluid ${styles.app}`}>
        {this.getNav()}
        {this.getError()}
        {this.props.children}
        {this.getDevTools()}
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    error: state.app.error,
    authorized: state.auth.authorized,
    // do not show the main error when on the auth route as the error is
    // shown inside of the auth container as it is centered on the page
    showMainError: state.routing.location.pathname.indexOf(AUTH_ROUTE) === -1
  }
}

export default connect(mapStateToProps)(App)
