import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';

class App extends Component {
  state = {
    username: '',
    password: '',
    auth: false
  };

  setInput = e => {
    this.setState({ [e.target.name]: e.target.value });
  }

  login = e => {
    e.preventDefault();
    
    const { username, password } = this.state;
    const user = { username, password };
    const headers = { header: { withCredentials: true, 'Content-Type': 'x-www-form-urlencoded' } };
    
    axios.post('http://localhost:5000/api/login', user, headers)
      .then(({ data }) => {
          if (data.auth === true) {
            console.log(data);
            this.setState({ auth: true });
          }
      })
      .catch(err => console.log(err));
  }

  checkAuth = () => {
    axios('http://localhost:5000/api/restricted/something')
      .then(({ data }) => console.log(data))
      .catch(err => console.log(err));
  }

  componentDidMount() {
    axios('http://localhost:5000/api/auth')
      .then(({ data }) => {
        console.log(data);
      })
      .catch(err => console.log(err));
  }
  
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        
        {
          (this.state.auth)
          ?
            <button onClick={ this.checkAuth }>Auth</button>
          :
            <form>
              <input
                name="username"
                onChange={ this.setInput }
                type="text"
                value={ this.state.inputVal }
              />
              <input
                name="password"
                onChange={ this.setInput }
                type="text"
                value={ this.state.inputVal }
              />
              <input
                type="submit"
                onClick={ this.login }
              />
            </form>
        }
        
      </div>
    );
  }
}

export default App;
