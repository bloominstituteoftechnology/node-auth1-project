import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { InputGroup, Input, Button, Col} from 'reactstrap';
import axios from 'axios';

class Login extends Component {
    constructor() {
        super();
        this.state = { 
            username: '',
            password: ''
         }
    }
    
   
    handleUsername = (e) => {
        this.setState({ username: e.target.value });
    };

    handlePass = (e) => {
        this.setState({ password: e.target.value })
    }

    registerUser = (e) => {
        axios
        .post('http://localhost:8000/api/login', {
            username: this.state.username,
            password: this.state.password
        })
        .then(res => {
            console.log('success!, you have been registered!', res);
        })
        .catch(error => {
            console.log('Error', error);
        });
        this.setState({ username: '', password: '' })
    };

    render() { 
        return ( 
            <div>
                <InputGroup style={{ marginTop: '15px', display: "flex", justifyContent: "center" }} >
                <Button color="danger" onClick={this.registerUser}>Submit</Button>
                <Col sm="3">
                <Input placeholder="username" type="text" onChange={this.handleUsername} value={this.state.username} />
                </Col>
                <Col sm="3">
                <Input placeholder="password" type="text" onChange={this.handlePass} value={this.state.password} />
                </Col>
                <Link style={{ alignSelf: 'center', textDecoration: 'underline' }}to={'/api/register'}>Don't have an account? Register Here </Link>
                </InputGroup>
                </div>
         )
    }
}
    
    export default Login;