import React from 'react';
import '../App.css';
import axios from 'axios';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: ''
    }
  }

  handleChange = (e) => {
    this.setState({[e.target.name]: e.target.value})
  }

  handleLogin = e => {
    e.preventDefault();
    const username = this.state.username;
    const password = this.state.password;
    console.log(username, password);
    axios.post('http://localhost:8000/api/login', {username, password}).then(response => {
      console.log(response.data);
      sessionStorage.setItem('fakeCookie', response.data.cook);
      document.cookie = 'something else=s%3AnFF0emWBhyufQzVy3D7XFvxhVmQqGS4D.gDFXPX3k8tZD0m9xbkqW6O%2FnnCYNDv209qZWiq1PkVI';
      window.location.reload();
    }).catch(err => {
      console.log(err);
    })

  }

  render() {
    return (
      <div>
        <form className="login">
        <h1 className="loginTitle">Lambda Notes</h1>
        <div>Username: <input name="username" placeholder="Username"
        onChange={this.handleChange} value={this.state.username} /></div><br/>
        <div>Password: <input type="password" name="password" placeholder="Password"
        onChange={this.handleChange} value={this.state.password} /><br/>
        <input className="sidebar-button login-button" type="submit" value="Log In" onClick={this.handleLogin} /></div>
        </form>
      </div>
    );
  }
}

export default Login;
