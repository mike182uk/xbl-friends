import React from 'react'
import FontAwesome from 'react-fontawesome'

import {
  APP_LOADING as APP_INITIALISING_ROUTE,
  AUTH as AUTH_ROUTE,
  FRIENDS as FRIENDS_ROUTE,
  SETTINGS as SETTINGS_ROUTE
} from '../../constants/routes'

import { Button } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'

import styles from './styles.css'

export default function AppMainNav () {
  return (
    <div className={styles.nav}>
      <LinkContainer to={{ pathname: APP_INITIALISING_ROUTE }} style={{ visibility: (__DEV__ || __INT__) ? 'visible' : 'hidden' }}>
        <Button bsStyle='primary'><FontAwesome name='hourglass-half' /></Button>
      </LinkContainer>
      <LinkContainer to={{ pathname: AUTH_ROUTE }} style={{ visibility: (__DEV__ || __INT__) ? 'visible' : 'hidden' }}>
        <Button bsStyle='primary'><FontAwesome name='lock' /></Button>
      </LinkContainer>
      <LinkContainer to={{ pathname: FRIENDS_ROUTE }}>
        <Button bsStyle='primary'><FontAwesome name='users' /></Button>
      </LinkContainer>
      <LinkContainer to={{ pathname: SETTINGS_ROUTE }}>
        <Button bsStyle='primary'><FontAwesome name='wrench' /></Button>
      </LinkContainer>
    </div>
  )
}
