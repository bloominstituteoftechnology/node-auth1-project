import React, { Component } from 'react';
import axios from 'axios';

class LoginPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: ''
        }
    }

    handleInputChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleFormSubmit = (e) => {
        e.preventDefault();
        const { username, password } = this.state;
        axios.post('http://localhost:5500/api/login', {
            username,
            password
        })
            .then(res => {
                console.log(res);
            })
            .catch(err => {
                console.log(err);
            })
    }

    render() {
        return (
            <div>
                <form onSubmit={this.handleFormSubmit}>
                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        onChange={this.handleInputChange}
                        value={this.state.username}
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        onChange={this.handleInputChange}
                        value={this.state.password}
                    />
                    <button>Submit</button>
                </form>
            </div>
        );
    }
}

export default LoginPage;