import React from 'react';
import { Link } from 'react-router-dom';

const UserItem = (props) => {
    return (
        <Link className="user-item" to={`/users/${props.user.id}`}>
            <p>{props.user.username}</p>
        </Link>
    )
}

export default UserItem;