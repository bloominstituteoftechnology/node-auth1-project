import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';

import '../styles.css';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: ''
        }
    }

    handleInputChange = e => {
        this.setState({ [e.target.name]: e.target.value });
    }

    authenticateUser = e => {
        e.preventDefault();
        const user = {username: this.state.username, password: this.state.password}
        axios.post(`http://localhost:5000/api/login`, user)
        .then(user => {
            console.log(user);
            this.setState({ username: '', password: '' })
        })
        .catch(err => {
            console.log(err);
        })
    }

    render() {
        return (
            <Form className="LoginForm">
                <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                    <Label for="username" className="mr-sm-2">UserName:</Label>
                    <Input type="text" id="username" onChange={this.handleInputChange} placeholder="username" name="username" value={this.state.username} required />
                </FormGroup>
                <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                    <Label for="password" className="mr-sm-2">Password:</Label>
                    <Input type="password" id="password" onChange={this.handleInputChange} placeholder="password" name="password" value={this.state.password} required />
                </FormGroup>
                <Link to="/users"><Button onClick={this.authenticateUser}>Login</Button></Link>
            </Form>
        )
    }
}

export default Login;