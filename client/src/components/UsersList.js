import React from 'react';

const UsersList = (props) => {
  return (
    <div>
      {props.users.map(user => <div className={"user"} key={user.id} user={user} >
        <p>{user.username}</p>
    </div>)}
    </div>
  );
}

export default UsersList;