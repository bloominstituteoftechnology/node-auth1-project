import React, { Component } from 'react';
import './App.css';
import Login from './components/LoginForm';
import {BrowserRouter as Router, Route} from 'react-router-dom';

class App extends Component {
  render() {
    return (
      
      <Router>
        <div className="App">
          <Route exact path='/' component={Login}/>
        </div>
      </Router>
    );
  }
}

export default App;
