import React, { Component } from 'react';
import axios from 'axios';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }

    handleInputChange = e => {
        this.setState({ [e.target.name]: e.target.value });
    }

    loginUser = userCreds => {
        axios
            .post('http://localhost:8000/login', userCreds)
            .then(response => {
                this.setState({ username: response.data, password: response.data })
            })
            .catch(error => {
                console.log(error)
            })
    }

    login = () => {
        const credentials={ username: this.state.username, password: this.state.password }
        this.loginUser(credentials)
        this.setState({ username: '', password: '' })
    }

    render() { 
        return ( 
            <div>
            <form className="input">
                <input 
                    className="username-input"
                    onChange={this.handleInputChange}
                    placeholder="Enter Username"
                    name="username"
                    value={this.state.username}
                />
                <input
                    className="password-input"
                    onChange={this.handleInputChange}
                    placeholder="Enter Password"
                    name="password"
                    value={this.state.password}
                />
            </form>
            <button 
                className="login-button"
                onClick={this.login}
            >
            Login
            </button>
        </div>
        )
    }
}
 
export default Login;