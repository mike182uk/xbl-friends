import React from 'react'
import { connect } from 'react-redux'
import { friendsRetrievalRequested } from '../../actions/friends'

import FriendsGroup from '../../components/FriendsGroup'
import UpdateFriends from '../../components/UpdateFriends'

import styles from './styles.css'

const Friends = class extends React.Component {
  getGroups (favouriteFriends, onlineFriends, offlineFriends) {
    const groups = []

    if (favouriteFriends.length) {
      groups.push({ title: 'Favourites', friends: favouriteFriends })
    }

    if (onlineFriends.length) {
      groups.push({ title: 'Online', friends: onlineFriends })
    }

    if (offlineFriends.length) {
      groups.push({ title: 'Offline', friends: offlineFriends })
    }

    return groups
  }

  render () {
    const {
      dispatch,
      favouriteFriends,
      onlineFriends,
      offlineFriends,
      lastUpdatedAt,
      updateInProgress
    } = this.props

    const groups = this.getGroups(favouriteFriends, onlineFriends, offlineFriends)

    return (
      <div className={styles.friends}>
        <UpdateFriends
          updating={updateInProgress}
          lastUpdatedAt={lastUpdatedAt}
          onRequestFriendsUpdate={() => dispatch(friendsRetrievalRequested())}
        />

        <div className={styles.groups}>
          {groups.map((group, index) =>
            <FriendsGroup key={index} title={group.title} friends={group.friends} />
          )}
        </div>

        {!groups.length ? <div className={styles.noFriends}><p className='lead'>No friends to display</p></div> : ''}
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    favouriteFriends: state.friends.friends.filter(friend => friend.favourite),
    onlineFriends: state.friends.friends.filter(friend => friend.online),
    offlineFriends: state.friends.friends.filter(friend => !friend.online),
    lastUpdatedAt: state.friends.lastUpdatedAt,
    updateInProgress: state.friends.updateInProgress
  }
}

export default connect(mapStateToProps)(Friends)
