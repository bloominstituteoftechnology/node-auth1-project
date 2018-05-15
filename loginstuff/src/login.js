import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom';
import axios from 'axios';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
          users: [],
          username: '',
          password: ''
        };
      }

      addUser = event => {
        const doo ={username: this.state.username, password: this.state.password }
        axios
        .post(`http://localhost:5000/api/login`, doo)
        .then(addBru => {
            console.log('hey');
        })
        .catch(err => {
            console.log(err);
        })
    }
    
    handleInputChange = e => {
        this.setState({ [e.target.name]: e.target.value });
      };

    render(){
        return (
            <div>
                    <form >
          <input
            onChange={this.handleInputChange}
            placeholder="username here"
            value={this.state.username}
            name="username"
            type="text"
          />
          <input
            onChange={this.handleInputChange}
            placeholder="password here"
            value={this.state.password}
            name="password"
            type="text"
          />
          <Link to='/users'><button onClick={this.addUser} value='submit' type='submit'>Login</button></Link>
          <Link to='/register'><button to='/register'>Need To Register</button></Link>
          </form>
            </div>
        )
    }
} 

export default Login;