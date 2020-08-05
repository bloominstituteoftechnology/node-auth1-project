import React from 'react';
import { Link } from 'react-router-dom';

const Register = () => {
    return (
        <form>
            <div class="input-group">
                <label htmlFor="fname">First Name:</label>
                <input id="fname" type="text" name="fname" placeholder="Enter First Name" />
            </div>

            <div class="input-group">
                <label htmlFor="lname">Last Name:</label>
                <input id="lname" type="text" name="lname" placeholder="Enter Last Name" />
            </div>

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
            <Link to = "/">Already have an account? Click Here!</Link>
        </form>
    );
};

export default Register;