import React from 'react'

class Login extends React.Component {
    constructor(){
        super();
        this.state = {
            username: '',
            password: '',
            loggedIn: false,
        }
    }

    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    }

    handleSubmit = event => {
        const user = this.state.username;
        const password = this.state.password;
        localStorage.setItem('user', user);
        localStorage.setItem('password', password);
        window.location.reload();
    }

    render(){
        return (
            <div className="loginform-container">
                <form className="loginform" onSubmit={this.handleSubmit}>
                    <input 
                        className="login-input"
                        placeholder="username"
                        type="text"
                        name="username"
                        value={this.state.username}
                        onChange={this.handleChange}
                    />
                    <input 
                        className="login-input"
                        placeholder="password"
                        type="text"
                        name="password"
                        value={this.state.password}
                        onChange={this.handleChange}
                    />
                    <button className="login-button" onClick={this.handleSubmit}>Login</button>
                </form>
            </div>
        )
    }
}

export default Login