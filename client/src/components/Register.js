import React from 'react';

const Register = (props) => {
    return (
        <form onSubmit={props.registerHandler}>
            <input
                type="text"
                name="username"
                value={props.username}
                onChange={props.changeHandler}
            />

            <input
                type="password"
                name="password"
                value={props.password}
                onChange={props.changeHandler}
            />

            <button onClick={props.registerHandler}>Register</button>
        </form>
    );
}

export default Register;