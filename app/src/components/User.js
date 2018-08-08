import React from "react";

const User = props => {
  return (
    <div>
      <p>{props.user.id}</p>
      <p>{props.user.user}</p>
      <p>{props.user.password}</p>
    </div>
  );
};

export default User;
