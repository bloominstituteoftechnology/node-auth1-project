import React, { Component } from 'react';
import axios from 'axios';

class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: ''
        };
    };

    registerNewUser = e => {
        e.preventDefault();
        axios
            .post(`http://localhost:4400/api/register`, {
                username: this.state.username,
                password: this.state.password
            })
            .then(response => {
                console.log(response);
            })
            .catch(err => console.log(err));
        this.setState({
            username: '',
            password: ''
        });
    }

    handleInput = e => {
        this.setState({[e.target.name]: e.target.value});
    };

    render() {
        return (
            <div>
                <h2>Register a new user!</h2>
                <form onSubmit={this.registerNewUser}>
                <input
                    onChange={this.handleInput}
                    placeholder='Username'
                    value={this.state.username}
                    name='username'
                />
                <input
                    onChange={this.handleInput}
                    placeholder='Password'
                    value={this.state.password}
                    name='password'
                />
                <button type='submit'>Register!</button>
                </form>
            </div>
            
        )
    }
}

export default Register;
