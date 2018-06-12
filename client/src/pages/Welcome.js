import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';

const Welcome = () => {
  return (
    <Fragment>
      <h1>Welcome!</h1>
      <Link to='/login'>Log in here.</Link>
      <br/>
      <Link to='/register'>Register here</Link>
    </Fragment>
  )
}

export default Welcome;