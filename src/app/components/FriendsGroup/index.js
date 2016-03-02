import React from 'react';

import FriendsList from '../FriendsList';

export default function FriendsGroup(props) {
  return (
    <div>
      <h3>{props.title}</h3>
      <hr />
      <FriendsList friends={props.friends} />
    </div>
  );
}
