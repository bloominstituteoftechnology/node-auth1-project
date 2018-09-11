import React, { Component } from 'react';
import "../components/App.css"
import {Route} from 'react-router-dom' 
import Home from './Home';
import Login from './Login';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Route exact path="/" component={Home}/> 
        <Route path ="/login" component ={Login}/> 
      </div>
    );
  }
}


export default App;
