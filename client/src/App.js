import React, { Component } from 'react';
import axios from 'axios';
import './App.css';
import {Switch, Link, Route, withRouter} from 'react-router-dom';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      username: '',
      password: '',
      newusername: '',
      newpassword: '',
      isLoggedIn: false,
      users: []
    }
  }

  handleInput = event => {
    event.preventDefault();
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  handleLogin = event => {
    event.preventDefault();
    let user = {
      username: this.state.username,
      password: this.state.password
    }

    axios.post(`http://localhost:9000/login`, user)
    .then(res => {
      console.log(res.data);
      if(res.status === 200){
        this.setState({
          isLoggedIn: true,
          username: '',
          password: ''
        })
      }
    })
    .catch(err => {
      console.log(err);
    })

  }

  handleRegister = event => {
    event.preventDefault();
    let user = {
      username: this.state.newusername,
      password: this.state.newpassword
    }
    if(user.username.length >= 4 && user.password.length >= 8){
      axios.post(`http://localhost:9000/register`, user)
      .then(res => {
        console.log(res.data);
        if(res.status === 201){
          this.setState({
            newusername: '',
            newpassword: '',
            isLoggedIn: true
          })
        }
        if(res.status === 409){
          window.alert('A user with that name already exists. Please try another username.')
        }
      })
      .catch(err => {
        console.log(err);
      })
    } else {
      window.alert('Username must have at least 4 characters. Password must have at least 8 characters.')
    }
    
  }

  render() {
    if(this.state.isLoggedIn){
      axios.get(`http://localhost:9000/users`)
      .then(res => {
        this.setState({
          users: res.data
        })
      })
    }
    return (
      <div className="App">
        
        <form>
          <h3>Log In</h3>
        <input onChange={this.handleInput} type='text' name='username' value={this.state.username}></input>
        <input onChange={this.handleInput} type = 'password' name='password' value={this.state.password}></input>
        <button onClick={this.handleLogin}>Log In</button>
        </form>

      <h1>Logged in?</h1>
      <h2>{this.state.isLoggedIn.toString()}</h2>

      <div>
        {this.state.users.map(user => {
          return <p key = {user.id}>{user.id} : {user.username}</p>
        })}


        <form>
          <h3>Register New User</h3>
        <input onChange={this.handleInput} type='text' name='newusername' value={this.state.newusername}></input>
        <input onChange={this.handleInput} type = 'password' name='newpassword' value={this.state.newpassword}></input>
        <button onClick={this.handleRegister}>Register</button>
        </form>
      </div>
      </div>
    );
  }
}

export default withRouter(App);
