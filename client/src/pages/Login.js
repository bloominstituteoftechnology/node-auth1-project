import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import LoginForm from './login/LoginForm';

const Login = (props) => {
  return (
    <div>
      { 
        props.match.path === '/login' ?
          <h1>Let's Login!</h1>
        :
          <h1>Let's Register</h1>
      }
      <LoginForm {...props} />
      <Link to='/'>Go back.</Link>
    </div>
  );
};

Login.propTypes = {};

export default Login;
