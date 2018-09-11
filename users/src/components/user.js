import React from 'react';

const User = (props) => {
    return(
        <div>
            <h1>Name: {props.name}</h1>
            <p>ID: {props.id}</p>
            <p>Password: {props.password}</p>
            <p>Created: {props.generated}</p>
        </div>
    )
}

export default User;