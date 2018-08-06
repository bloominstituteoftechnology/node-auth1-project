import React from 'react';

const User = props => {
    return (
        <div className='user-container'>
            <p><strong>{props.user.username}</strong></p>
            <p>{props.user.password}</p>
        </div>
    );
}

export default User;