import React from 'react';
import axios from 'axios';

class Login extends React.Component {
    constructor() {
        super();

        this.state = {
            username: 'DirupT',
            password: 'Test'
        }
    }

    handleInput = event => {
        this.setState({ [event.target.name]: event.target.value });
    }

    login = () => {
        const user = { username: this.state.username, password: this.state.password }
        axios
            .post('http://localhost:8000/api/login', user)
            .then(response => this.props.history.push('/users'))
            .catch(err => console.log(err));
    }

    render() {
        return (
            <form onSubmit={event => event.preventDefault()}>
                <input type='text' placeholder='Username' name='username' value={this.state.username} onChange={this.handleInput} />
                <input type='text' placeholder='Password' name='password' value={this.state.password} onChange={this.handleInput} />
                <button onClick={this.login}>Log In</button>
            </form>
        );
    }
}

export default Login;