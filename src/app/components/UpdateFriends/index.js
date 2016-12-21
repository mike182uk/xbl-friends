import React from 'react'
import moment from 'moment'

import FontAwesome from 'react-fontawesome'
import LoadingStateButton from '../LoadingStateButton'

import styles from './styles.css'

export default class Update extends React.Component {
  componentDidMount () {
    const forceUpdate = () => {
      if (!this.props.updating && this.props.lastUpdatedAt) {
        this.forceUpdate()
      }
    }

    this.lastUpdatedAtTimer = setInterval(forceUpdate, 5000)

    forceUpdate()
  }

  componentWillUnmount () {
    clearInterval(this.lastUpdatedAtTimer)
  }

  render () {
    const { lastUpdatedAt, onRequestFriendsUpdate, updating } = this.props

    return (
      <div className={styles.update}>
        <p>
          <FontAwesome name='clock-o' /> <strong>Last Updated:</strong> <em>{lastUpdatedAt ? moment(lastUpdatedAt).fromNow() : 'Never'}</em>
        </p>
        <div className={styles.buttonContainer}>
          <LoadingStateButton
            onClick={() => onRequestFriendsUpdate()}
            isLoading={updating}
            loadingText='Updating...'
            bsStyle='primary'
          >Update</LoadingStateButton>
        </div>
      </div>
    )
  }
}
