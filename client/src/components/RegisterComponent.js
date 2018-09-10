import React from "react";
import { Link } from "react-router-dom";
function RegiterForm(props) {
  return (
    <div>
      <p>User Name</p>
      <input
        type="text"
        name="username"
        onChange={props.userInputChange}
        required
      />
      <p>Password</p>
      <input
        type="text"
        name="password"
        type="password"
        onChange={props.passwordInputChage}
        required
      />
      <button onClick={props.submit}>Submit</button>
      <Link to="/">already a user</Link>
    </div>
  );
}

export default RegiterForm;
