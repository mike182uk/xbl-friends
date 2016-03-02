import React from 'react';

import Friend from '../Friend';

export default function List(props) {
  return (
    <div>
      {props.friends.map((friend, index) =>
        <Friend
          key={index}
          gamertag={friend.gamertag}
          name={friend.realname}
          gamerpic={friend.gamerpic}
          primaryStatus={friend.primaryInfo}
          secondaryStatus={friend.secondaryInfo}
          online={friend.online}
        />
      )}
    </div>
  );
}
