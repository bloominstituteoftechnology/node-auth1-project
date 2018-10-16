import React from "react";

const Login = props => {
  return (
    <div>
      <h1>Login Page</h1>
      <div>
        <label htmlFor="username">Username</label>
        <input type="text" name="username" placeholder="username..." />
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input type="password" name="password" placeholder="password..." />
      </div>
      <div>
        <button>Login</button>
      </div>
    </div>
  );
};

export default Login;
