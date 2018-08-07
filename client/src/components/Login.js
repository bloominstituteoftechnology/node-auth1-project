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
    console.log('Login Handled');
    const username = this.state.username;
    const password = this.state.password;
    console.log(username, password);
    axios.post('http://localhost:8000/api/login', {username, password}).then(response => {
      console.log(response.data);
    }).catch(err => {
      console.log(err);
    })
    window.location.reload();
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
