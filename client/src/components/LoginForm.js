import React, { Component } from 'react';
import axios from 'axios';

class LoginForm extends Component{
    constructor(props){
        super(props);
        this.state = {
            username: '',
            password: '',
        }
    }

    login = event => {
        event.preventDefault();
        const {username, password} = this.state
    
        axios
        .post('http://localhost:5000/api/login', {username, password})
        .then((response) => {
            this.setState({login: response.data, username:'', password:''})
        })
        .catch(err => {
            console.log('error', err)
        })
    }
    
    handleInput = e => {
        this.setState({[e.target.name]: e.target.value})
    }
    
    
    render() {
        return (
            <div className="LoginForm">
                <form onSubimt={this.login}>
                <input 
                    onChange={this.handleInput}
                    placeholder="Username"
                    value={this.set.username}
                    name="username"
                />
                <input 
                    onChange={this.handleInput}
                    placeholder="Password"
                    value={this.set.password}
                    name="password"
                />
                </form>
            </div>
        )
    }    
}

export default LoginForm;

