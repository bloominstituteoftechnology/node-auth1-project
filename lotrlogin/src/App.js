import React, { Component } from 'react';
import ring from './oneringGIF.gif';
import './App.css';
import UserInputForm from './components/newUser';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={ring} className="ring-logo" alt="logo" />
        </header>
        <UserInputForm/>
      </div>
    );
  }
}

export default App;
