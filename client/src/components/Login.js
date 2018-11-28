import React from 'react';

const Login = (props) => {
    return(
        <form onSubmit={props.loginHandler}>
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

            <button onClick={props.loginHandler}>login</button>
        </form>
    );
}

export default Login;