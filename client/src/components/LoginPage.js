import React from 'react'


const LoginPage = props => {
    return (
        <div>
            <form action="onSubmit">
            <input 
            placeholder="enter username"
            type="text"
            name="username"
            onChange={props.loginHandler}
            value={props.username}
            />
            <input 
            type="password"
            placeholder="enter password"
            name="password"
            onChange={props.loginHandler}
            value={props.password}
            />
            <button onClick={props.loginEvent}>Login</button>
            <button onClick={props.registerEvent}>Register</button>
            </form>
        </div>
    )
}

export default LoginPage;