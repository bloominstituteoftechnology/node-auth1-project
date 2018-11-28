import React from 'react';

const Register = (props) => {
    return (
        <div onSubmit={props.submitHandler}>
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

            <button onClick={props.submitHandler}>Register</button>
        </div>
    );
}

export default Register;