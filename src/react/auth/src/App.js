import React, { Component } from 'react';
import axios from 'axios';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  state = {
    username: '',
    password: '',
    loggedIn: false,
    registered: false,
  }
  onChange = (e) => {
    this.setState({[ e.target.name ] : e.target.value })
  }
  onSubmitLogin = (e) => {
    e.preventDefault();
    this.loginUser({
      username: this.state.username,
      password: this.state.password,
    });
    this.setState({
      username: '',
      password: ''
    })
  }
  onSubmitRegister = (e) => {
    e.preventDefault();
    this.registerUser({
      username: this.state.username,
      password: this.state.password,
    });
  }
  registerUser = (body) => {
    const url = 'http://localhost:3030/users'
    axios.post(url, body)
      .then(({ data }) => {
        console.log(data);
        if (data.username) {
          this.setState({ registered : true })
        } else console.log(data);
      })
      .catch(err => console.log(err));
  }

  loginUser = (body) => {
    const url = 'http://localhost:3030/log-in'
    axios.post(url, body)
      .then(({ data }) => {
        console.log(data);
        if (data.success) {
          this.setState({ loggedIn : true })
        } else console.log(data);
      })
      .catch(err => console.log(err));
  }
  
  render() {
    return (
      <div className="App">
        <input onChange={this.onChange} name="username"/>
        <input onChange={this.onChange} name="password"/>
        <button onClick={this.onSubmitLogin}>Login</button>
        <a><button onClick={this.onSubmitRegister}>Register</button></a>

        { this.state.loggedIn && <div>Logged In</div>}
        { this.state.registered && <div>Logged In</div>}
      </div>
    );
  }
}

export default App;
