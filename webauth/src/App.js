import React, { Component } from 'react';
import './App.css';
import Login from './components/Login';
import Starwars from './components/Homepage';
import Authenticate from './components/Auth';

class App extends Component {
  constructor() {
    super();
    this.state = {};
  }

  render() {
    return (
      <div className="App">
       <ComponentFromAuth />
      </div>
    );
  }
}

const ComponentFromAuth = Authenticate(Starwars)(Login);

export default App;