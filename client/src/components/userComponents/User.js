
import React from 'react'
// import PropTypes from 'prop-types';

const User = props => {
  return (
    <div>
      <h3>Username:{props.user.username}</h3>
      <p>Hashed Password: {props.user.password}</p>
      <p>User ID: {props.user.id}</p>
    </div>
  )
}

User.propTypes = {

}

export default User
