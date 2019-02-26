import React from 'react';

function LoginForm(props) {

    const handleClick = e => {
        e.preventDefault();
        props.registerUser();
    }

    return (
        <div>
            <form className="Form">
            
                <input className="username"
                    type="text"
                    name="username"
                    placeholder="username"
                    onChange={props.changeHandler}
                    value={props.user.username}
                />

                <input className="password"
                    type="text"
                    name="password"
                    placeholder="password"
                    onChange={props.changeHandler}
                    value={props.user.password}
                />

                <button className="button" onClick={handleClick}>Sign In</button>

            </form>
        </div>
    );
}

export default LoginForm;