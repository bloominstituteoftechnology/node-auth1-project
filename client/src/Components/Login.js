import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
axios.defaults.withCredentials = true;

class Login extends Component {
    constructor() {
        super();
        this.state = {
            username: '',
            password: ''
        }        
    }

    handleSubmit = e => {
        const { username, password } = this.state
        axios
            .post('http://localhost:5555/api/login', { username, password })
            .then(res => {
                this.setState({ username: '', password: '' })
                document.location.href=('http://localhost:3000/restricted/users');
            })
    }

    handleInput = e => {
        this.setState({ [e.target.name]: e.target.value })
    }
    
    render() {
        return (
            <div className='login-container'>
                <div className='login-wrapper'>
                <div className='log-in'>
                    <h1 className='header'>View Your Friends</h1>                
                    <input className='input-box'
                        type = 'text'
                        name = 'username'
                        placeholder = 'Username'
                        value = {this.state.username}
                        onChange = {this.handleInput}
                    />                
                    <input className='input-box'
                        type = 'text'
                        name = 'password'
                        placeholder = 'Password'
                        value = {this.state.password}
                        onChange = {this.handleInput}
                    />
                    <button className='login-btn' onClick={this.handleSubmit}>Continue</button>
                    <a href='#'>Forgot password?</a>
                </div>
                <div className='sign-up'>
                    <p>Don't have an account?<span className='signUp-msg'><Link to='/register'>Sign up</Link></span></p>
                </div>
                </div>
                <div className='footer'>
                <a href='#'>ABOUT US</a>
                <a href='#'>SUPPORT</a>
                <a href='#'>BLOG</a>
                <a href='#'>JOBS</a>
                <a href='#'>TERMS AND PRIVACY</a>
                </div>
            </div>
        );
    }
}

export default Login;