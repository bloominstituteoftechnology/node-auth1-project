import React from 'react';
import axios from 'axios';

class Login extends React.Component {
    constructor() {
        super();

        this.state = {
            username: '',
            password: '',
            invalid: false
        }
    }

    handleInput = event => {
        this.setState({ [event.target.name]: event.target.value });
    }

    login = () => {
        if (this.state.username === '' || this.state.password === '') {
            alert('Please enter a username and password!');
            return;
        }

        const user = { username: this.state.username, password: this.state.password }

        axios
            .post('http://localhost:8000/api/login', user)
            .then(response => this.props.history.push('/users'))
            .catch(err => {
                if (!err) return;
                if (err.response.status === 401) {
                    this.setState({ invalid: true })
                }
            });
    }

    render() {
        return (
            <form onSubmit={event => event.preventDefault()}>
                <h1>Login</h1>
                <input type='text' placeholder='Username' name='username' value={this.state.username} onChange={this.handleInput} />
                <input type='password' placeholder='Password' name='password' value={this.state.password} onChange={this.handleInput} />
                <button onClick={this.login}>Log In</button>
                <button onClick={() => this.props.history.push('/register')}>Register</button>
                {this.state.invalid ? <p>Invalid Credentials!</p> : null}
            </form>
        );
    }
}

export default Login;