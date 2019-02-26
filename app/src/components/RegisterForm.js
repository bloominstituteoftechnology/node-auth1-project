import React, { useState } from 'react';
import { Context } from '../Context/Provider';

function Form(props) {
  const [username, setFirstName] = useState('');
  const [password, setPassword] = useState('');
  let user = { username: username, password: password };
  return (
    <Context.Consumer>
      {context => (
        <form method="POST" onSubmit={e => context.registerUser(e, user)}>
          <h2>Register</h2>
          <input
            value={username}
            onChange={e => setFirstName(e.target.value)}
            placeholder="First name"
            type="text"
            name="username"
            required
          />

          <input
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Password"
            type="password"
            name="password"
            required
          />
          <button type="submit">Submit</button>
        </form>
      )}
    </Context.Consumer>
  );
}
export default Form;
