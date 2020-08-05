import React from 'react';
import { Link } from 'react-router-dom';

const Login = () => {
    return (
        <form>
            <div class="input-group">
                <label htmlFor="username">Username:</label>
                <input id="username" type="text" name="username" placeholder="Enter Username" />
            </div>

            <div class="input-group">
                <label htmlFor="password">Password:</label>
                <input id="password" type="password" name="password" placeholder="Enter Password" />
            </div>

            <button type="submit">LOGIN</button>
            <br />
            <Link to = "/register">Don't have an account? Click Here!</Link>
        </form>
    );
};

export default Login;