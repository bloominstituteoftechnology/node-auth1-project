import React, { Component } from 'react';
import Axios from 'axios';
import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      users:[],
      loggedIn: false
    }
  }
  componentDidMount() {
    if (this.state.loggedIn){
      Axios
      .get(`http://localhost:6969/api/users`)
      .then(response => {
        this.setState(() => ({ users: response.data }));
      })
      .catch(err => {console.log(err)});
    }    
  }
  render() {
    return (
      <div className="App">
        
      </div>
    );
  }
}

export default App;
