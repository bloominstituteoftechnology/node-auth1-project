import React from 'react';
import { Form, FormGroup, Label, Input } from 'reactstrap';
import Button from './Button'
import axios from 'axios'
import { Link } from 'react-router-dom'


class InputF extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: ''
        };
    }
    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }
    registerRender = () => {
        return (
            <Link to="/login"><Button text="Submit registration" function={this.register} /></Link>
        );
    }
    register = () => {
        axios.post("http://localhost:8000/api/register", { username: this.state.username, password: this.state.password })
            .then(result => alert(result))
            .catch(err => console.log(err.message))
    }
    loginRender = () => {
        return (
            <Link to="/users"><Button text="Submit login" function={this.login} /></Link>
        );
    }
    login = () => {
        axios.post("http://localhost:8000/api/login", { username: this.state.username, password: this.state.password })
    }
    render() {
        console.log(this.props.match)
        return (
            <div>
                <Form>
                    <FormGroup>
                        <Label for="username">Username</Label>
                        <Input type="username" onChange={this.handleChange} name="username" id="username" placeholder="Please enter the Username" />
                    </FormGroup>
                    <FormGroup>
                        <Label for="Password">Password</Label>
                        <Input type="password" onChange={this.handleChange} name="password" id="Password" placeholder="Please enter your Password" />
                    </FormGroup>
                    {this.props.match.path === "/login" ? this.loginRender() : this.registerRender()}
                </Form>
            </div>
        );
    }
}


export default InputF;
