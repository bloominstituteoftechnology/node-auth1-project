import React from "react";

const Register = props => {
  return (
    <div>
      <h1>Registration Page</h1>
      <div>
        <label htmlFor="username">Username</label>
        <input type="text" name="username" placeholder="username..." />
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input type="password" name="password" placeholder="password..." />
      </div>
      <div>
        <button>Register</button>
      </div>
    </div>
  );
};

export default Register;
