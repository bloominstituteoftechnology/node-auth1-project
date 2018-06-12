import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users:[]
    };
  }

  componentDidMount() {
    this.gatherUsers();
  }

  gatherUsers = () => {
    axios.get('http://localhost:8000/api/users')
      .then(res => {
	console.log(res);
	this.setState({ users: res.users });
      })
      .catch(error => console.log(error));
  }
  
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
	<div>
	  {this.state.users.map(user => {
	    return (
	      {user}
	    );
	  })};
	  </div>
      </div>
    );
  }
}

export default App;
