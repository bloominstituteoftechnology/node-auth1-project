import React, { Component } from 'react';
import axios from "axios";
import LoginForm from './components/view/LoginForm.js';
import './App.css';
import UserListContainer from './components/container/UserListContainer.js';

class App extends Component {
  constructor() {
    super()
    this.state = {
      users : []
    }
  }

  componentDidMount() {
    axios.get('http://localhost:5000/api/users')
      .then(response => { this.setState({ users: response.data })})
      .catch(err => console.log(err));
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <LoginForm/>
        <UserListContainer/>
      </div>
    );
  }
}

export default App;
