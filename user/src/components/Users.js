import React from "react";

const Users = props => {
  return (
    <div>
      {props.users.map(user => {
        return <h4 key={user.username}>{user.username}</h4>;
      })}
    </div>
  );
};

export default Users;
