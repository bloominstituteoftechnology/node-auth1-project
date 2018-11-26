import React, { Component } from 'react';
import axios from 'axios';
import {Redirect} from 'react-router-dom';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: null,
            password: null,
            loggedIn: false,
        }
    }

    changeHandler = event => {
        event.preventDefault();
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    logIn = event => {
        event.preventDefault();
        const {username, password} = this.state;
        if (!username || !password) {
            alert("Please enter a username and password");
        } else {
            axios.post('http://localhost:9000/api/login', {username, password})
                .then(res => console.log(res))
                .catch(err => console.dir(err));
        }
        this.setState({
            username: null,
            password: null,
            loggedIn: true
        })
        event.target.reset();
    }

    render() { 
        if (this.state.loggedIn === true) {
            return (
                <Redirect to='/'></Redirect>
            )
        }
        return (
            <div>
                <h3>Log in here!</h3>
                <form onSubmit={this.logIn}>
                    <input type='text' placeholder='username' name='username' value={this.value} onChange={this.changeHandler}/>
                    <input type='password' placeholder='password' name='password' value={this.value} onChange={this.changeHandler}/>
                    <input type='submit' />
                </form>
            </div>
        );
    }
}
 
export default Login;