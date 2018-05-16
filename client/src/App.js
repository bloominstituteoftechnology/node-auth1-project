import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import Authenticate from './Authenticate/Authenticate';

class App extends Component {
  constructor(props) {
    super(props);
    this.state= {
      users:[]
    }

  }

  
  componentDidMount = () => {
    this.fetchData()
  }
  fetchData = () => {
    axios.get(`http://localhost:8000/api/test`)
    .then(res => {
        let usrData = res.data;
        console.log('This is the user data',res.data)
        this.setState({ users: usrData })
    })
    .catch(err => console.log(err))


}
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <Authenticate fetchData={() => this.fetchData()} />
      </div>
    );
  }
}

export default App;
