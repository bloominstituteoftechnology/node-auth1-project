import React, { Component } from 'react';
import logo from './logo.svg';

class App extends Component {
  constructor(){
    super();
    this.state = {
      username : '',
      password : ''
    }
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <form className="login-form" onSubmit="#">
            <input className="input" type="text" placeholder="Username" />
            <input className="input" type="password" placeholder="Password" />
            <input className="input submit-btn" type="submit" />
          </form>
        </header>
        <p>Brought to you by gradients</p>
      </div>
    );
  }
}

export default App;
