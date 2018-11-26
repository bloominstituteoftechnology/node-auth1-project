import React, { Component } from 'react';
import axios from 'axios';

class Signup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: null,
            password: null
        }
    }

    changeHandler = event => {
        event.preventDefault();
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    signUp = event => {
        event.preventDefault();
        const {username, password} = this.state;
        if (!username || !password) {
            alert("Please enter a username and password");
        } else {
            axios.post('http://localhost:9000/api/register', {username, password})
                .then(res => alert('Signup Complete!'))
                .catch(err => console.dir(err));
        }
        this.setState({
            username: null,
            password: null,
        })
        event.target.reset();
    }

    render() { 
        return (
            <div>
                <h3>Sign up here!</h3>
                <form onSubmit={this.signUp}>
                    <input type='text' placeholder='username' name='username' value={this.value} onChange={this.changeHandler}/>
                    <input type='password' placeholder='password' name='password' value={this.value} onChange={this.changeHandler}/>
                    <input type='submit' />
                </form>
            </div>
        );
    }
}
 
export default Signup;