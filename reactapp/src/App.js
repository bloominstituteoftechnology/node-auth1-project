import React, { Component } from 'react';
import './App.css';
import Register from './components/Register';
import Login from './components/Login';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Register />
        {/* <Login /> */}
      </div>
    );
  }
}

export default App;
