import React from 'react';
import axios from 'axios';

class Register extends React.Component {
    constructor() {
        super();

        this.state = {
            username: '',
            password: ''
        }
    }

    handleInput = event => {
        this.setState({ [event.target.name]: event.target.value });
    }

    register = () => {
        if (this.state.username === '' || this.state.password === '') {
            alert('Please enter a username and password!');
            return;
        }

        const user = { username: this.state.username, password: this.state.password }

        axios
            .post('http://localhost:8000/api/register', user)
            .then(response => this.props.history.push('/users'))
            .catch(err => console.log(err));
    }

    render() {
        return (
            <form onSubmit={event => event.preventDefault()}>
                <h1>Register</h1>
                <input type='text' placeholder='Username' name='username' value={this.state.username} onChange={this.handleInput} />
                <input type='password' placeholder='Password' name='password' value={this.state.password} onChange={this.handleInput} />
                <button onClick={this.register}>Sign Up</button>
            </form>
        );
    }
}

export default Register;