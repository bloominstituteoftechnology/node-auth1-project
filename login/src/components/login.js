import React from 'react';
import '../App.css';


const Login = () => {
    return(
        <div>
            <h1>Login to the Authenticator!</h1>
            <form>
                <div>
                    <label for="name">
                        Username:
                    </label>
                    <input type ="text" id="username" name="username"></input>
                </div>

                <div>
                    <label for="password">
                        Password:
                    </label>
                    <input type="text" id="password" name="password"></input>
                </div>
                <div class="button">
                    <button type="submit">Login</button>
                </div>
            </form>
        </div>
    )
}

export default Login;