import React, { Component } from 'react';
import "../components/App.css"
import {Route} from 'react-router-dom' 
import Home from './Home';
import Login from './Login';
import Register from './Register';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Route exact path="/" component={Home}/> 
        <Route path ="/login" component ={Login}/> 
        <Route path ="/register" component ={Register}/>
      </div>
    );
  }
}


export default App;
