import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {

  constructor(){
    super(); 

    this.setState = {
      users: [], 
    }
    
  }


  componentDidMount = () => {
    this.fetchDeta(); 

  }


  fetchDeta = () => {
    axios.get('http://localhost:8000/api/users')
    .then(res => {
      this.userData = res.data; 
      this.setState({users : userData})
    })
  }












  render() {
    return (
    );
  }
}

export default App;
