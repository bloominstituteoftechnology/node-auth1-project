import React, { Component } from 'react';
import axios from 'axios'

import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: []
    }
  }
  
  componentDidMount() {
    axios.get(`http://localhost:5000/api/users`)
    .then(res => {
      this.setState({ users: res.users })
      console.log(this.state.users)
    })
    .catch(err => {
      console.log(err)
    })
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        
      </div>
    );
  }
}

export default App;
