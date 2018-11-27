import React from 'react'
// import PropTypes from 'prop-types';
import User from './User';

const UsersList = props => {
  return (
    <div>
      {props.users.map(user => 
        <User key={user.id} user={user} />
      )}
      <button onClick={props.logout} >Log Out</button>
    </div>
  )
}

UsersList.propTypes = {

}

export default UsersList
