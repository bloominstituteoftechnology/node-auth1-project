import React, { Component } from 'react';
import { Button, Form, FormGroup, Input } from 'reactstrap';
import styled from 'styled-components';

const EntryPage = styled.div`
  background-image: URL('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNh9wBs3Ag5AHHwOwJR2hcQCiMc1jIP6bitH-9Zp8WKZSlKCKnSw');
  height: 700px;
  color: red;
`;


class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: ''
        };
    }

handleInputChange = e => {
    this.setState({[e.target.name]: e.target.value})
}

Login = e => {
    e.preventDefault();
    const user = this.state.username;
    localStorage.setItem('user', user);
    window.location.reload();
}

Logout = e => {
    e.preventDefault();
    const user = this.state.username;
    localStorage.removeItem('user', user);
    window.location.reload();
}

render() {
    return (
        <EntryPage>
        <Form className='Entry-form' >
            <div>
                <h1>Welcome to StarWars Universe!</h1>
                <h3>The force is strong with this One!</h3>
            </div>
            <FormGroup>
                <Input
                    type='text'
                    placeholder='Username'
                    name='username'
                    value={this.state.username}
                    onChange={this.handleInputChange}
                />    
            </FormGroup>
            <FormGroup>
                <Input
                    type='password'
                    placeholder='Password'
                    name='password'
                    value={this.state.password}
                    onChange={this.handleInputChange}
                />
            </FormGroup>

            <Button onClick={this.Login}>Log In</Button>
            <Button onClick={this.Logout}>Log Out</Button>
        </Form>
        </EntryPage>
    );
}

};

export default Login;
