import React from "react";

const Users = props => {
  return (
    <div>
      {props.users.map(user => {
        return <p key={user.username}>{user.username}</p>;
      })}
    </div>
  );
};

export default Users;
