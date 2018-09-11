import React from 'react';
import axios from 'axios';

const URL = 'http://localhost:8000/api'

class Login extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            username: '',
            password: '',
        }
    }
    handleChange = e => {
        this.setState({ [e.target.name]: e.target.value});
    }
    submit = e => {
        e.preventDefault();
        const { username, password } = this.state;
        const newUser = {
            username,
            password
        }
        axios.post(`${URL}/login`, newUser)
                .then( res => console.log(res))
                .catch (err => console.log(err.message))
    }
    render() {
        return (
            <div>
                <h1> Login </h1>
                <input name='username' placeholder='username' type='text' onChange={this.handleChange} /><br />
                <input name='password' placeholder='password' type='text' onChange={this.handleChange} /><br />
                <button onClick={this.submit}>Submit</button>
            </div>
        )
    }
};

export default Login;