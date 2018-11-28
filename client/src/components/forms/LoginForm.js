import React from 'react'
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const LoginForm = props => {
  return (
    <form>
      <input
        onChange={props.handleChange}
        placeholder="Username"
        value={props.username}
        name="username"
      />
      <input
        onChange={props.handleChange}
        placeholder="password"
        value={props.password}
        name="password"
        type="password"
      />
      <button onClick={props.login}>Submit</button>
      <Link to='/register'>Register</Link>
    </form>
  )
}

LoginForm.propTypes = {
  login: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired
}

export default LoginForm;
