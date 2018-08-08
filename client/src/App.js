import React, { Component } from 'react';
import './App.css';
import Login from './components/LoginForm';
import UserList from './components/UserList';
import {BrowserRouter as Router, Route} from 'react-router-dom';

class App extends Component {
  render() {
    return (
      
      <Router>
        <div className="App">
          <Route exact path='/' component={Login}/>
          <Route path='/users' component={UserList} />
        </div>
      </Router>
    );
  }
}

export default App;
