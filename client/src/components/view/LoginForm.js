import React from 'react';
import axios from "axios";

class LoginForm extends React.Component {
    constructor() {
        super()
        this.state = {
            username: '',
            password: ''
        }
    }

    handleChange = e => {
        e.preventDefault();
        this.setState({ [e.target.name]: e.target.value });
    }

    handleSubmit = (e, update) => {
        e.preventDefault();
        axios.post('http://localhost:5000/login', update)
            .then(response => console.log(response))
            .catch(err => console.log(err));
    }

    render() {
        const { username, password } = this.state;
        return (
            <div>
                <form>
                    <input type="text" name="username" value={username} placeholder="username" onChange={(e) => this.handleChange(e)}/>
                    <input type="text" name="password" value={password} placeholder="password" onChange={(e) => this.handleChange(e)}/>
                    <button onClick={(e) => this.handleSubmit(e, { username, password })}>Log In</button>
                </form>
            </div>
        );
    }
}

export default LoginForm;