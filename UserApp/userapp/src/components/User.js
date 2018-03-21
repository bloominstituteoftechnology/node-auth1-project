import React from 'react';
import '../styles/User.css';

const User = (props) => {
    console.log("Props are", props);
  return (
    <li className="User">
      <h3>{props.username}</h3>
    </li>
  );
}

export default User;