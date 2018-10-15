import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import HomeContainer from './components/HomeContainer'
import {Route} from 'react-router-dom'

class App extends Component {
  render() {
    return (
      <div className="App">
      <Route path='/' render = {props => {
        return(<HomeContainer {...props}/>)
        
      }}/>
        
      </div>
    );
  }
}

export default App;
