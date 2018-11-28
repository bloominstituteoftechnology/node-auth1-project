import React, { Component } from 'react';
import './App.css';
import axios from 'axios'
axios.defaults.withCredentials = true

class App extends Component {
  render() {
    return (
      <div className="App">
        <div>users</div>
      </div>
    );
  }
}

export default App;
