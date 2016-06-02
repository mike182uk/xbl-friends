import React from 'react'
import FontAwesome from 'react-fontawesome'
import ENV from '../../utils/env'

import {
  APP_LOADING as APP_INITIALISING_ROUTE,
  AUTH as AUTH_ROUTE,
  FRIENDS as FRIENDS_ROUTE,
  SETTINGS as SETTINGS_ROUTE
} from '../../constants/routes'

import { Button } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'

import styles from './style.css'

export default function AppMainNav () {
  return (
    <div className={styles.nav}>
      <LinkContainer to={{ pathname: APP_INITIALISING_ROUTE }} style={{ visibility: ENV === 'dev' ? 'visible' : 'hidden' }}>
        <Button><FontAwesome name='hourglass-half' /></Button>
      </LinkContainer>
      <LinkContainer to={{ pathname: AUTH_ROUTE }} style={{ visibility: ENV === 'dev' ? 'visible' : 'hidden' }}>
        <Button><FontAwesome name='lock' /></Button>
      </LinkContainer>
      <LinkContainer to={{ pathname: FRIENDS_ROUTE }}>
        <Button><FontAwesome name='users' /></Button>
      </LinkContainer>
      <LinkContainer to={{ pathname: SETTINGS_ROUTE }}>
        <Button><FontAwesome name='wrench' /></Button>
      </LinkContainer>
    </div>
  )
}
