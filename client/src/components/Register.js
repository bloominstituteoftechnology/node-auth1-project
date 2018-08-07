import React from 'react';
import axios from 'axios';

class Register extends React.Component {
    constructor() {
        super();

        this.state = {
            username: '',
            password: '',
            userExists: false
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

        axios.defaults.withCredentials = true
        axios
            .post('http://localhost:8000/api/register', user)
            .then(() => this.props.history.push('/users'))
            .catch(err => {
                if (!err) return;
                if (err.response.status === 400) {
                    this.setState({ userExists: true })
                }
            });
    }

    render() {
        return (
            <div className='register-container'>
                <form className='register-form' onSubmit={event => event.preventDefault()}>
                    <h1>Register</h1>
                    <input type='text' placeholder='Username' name='username' value={this.state.username} onChange={this.handleInput} />
                    <input type='password' placeholder='Password' name='password' value={this.state.password} onChange={this.handleInput} />
                    <button onClick={this.register}>Sign Up</button>
                    {this.state.userExists ? <p>User with that name already exists!</p> : null}
                </form>
            </div>
        );
    }
}

export default Register;