import React from "react";
import { Link } from "react-router-dom";
function LoginForm(props) {
  return (
    <div>
      <p>User Name</p>
      <input
        type="text"
        name="username"
        onChange={props.inputChange}
        required
      />
      <p>Password</p>
      <input
        type="text"
        name="password"
        type="password"
        onChange={props.inputChange}
        required
      />
      <button onClick={props.submit}>Submit</button>
      <Link to="/register">Sign in instead</Link>
    </div>
  );
}

export default LoginForm;
