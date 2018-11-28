import React from 'react';

const Login = (props) => {
    return(
        <form action={props.submitHandler} method="POST">
            <input 
                type="text"
                name="username"
                onChange={props.changeHandler}
                value={props.username}
            />

            <input
                type="password"
                name="password"
                onChange={props.changeHandler}
                value={props.password}
            />

            <button onClick={props.submitHandler}>login</button>
        </form>
    );
}

export default Login;