import React from 'react';
import axios from 'axios';

const URL = 'http://localhost:8000/api'

class Register extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            username: '',
            password: '',
            users: [],
        }
    }
    handleChange = e => {
        this.setState({ [e.target.name]: e.target.value});
    }
    submit = e => {
        e.preventDefault();
        const newUser = {username: this.state.username, password: this.state.password }
        axios.post(`${URL}/register`, newUser)
                .then( res => this.setState({users: res.data}) )
                .catch (err => console.log(err))
    }
    render() {
        return (
            <div>
                <h1> Register </h1>
                <input name='username' placeholder='username' type='text' onChange={this.handleChange} /><br />
                <input name='password' placeholder='password' type='text' onChange={this.handleChange} /><br />
                <button onClick={this.submit}>Submit</button>
            </div>
        )
    }
};

export default Register;