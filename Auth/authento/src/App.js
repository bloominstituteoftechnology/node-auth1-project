import React, { Component } from 'react';
import logo from './cross-swords-png-3.png';
import axios from 'axios';
import './App.css';

////created
import Form from './Form';
import List from './List';



class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      users: [],
      user: {
        username: '',
        password:'',
      },
      };
    }
  

   componentDidMount() {
     axios
     .get('http://localhost:7700/users')
     .then((response) => {
      this.setState({users: response.data})
      console.log(response.data);
     })
     .catch(err => {
       console.log(err);
     })
   };





  render() {
    console.log(this.state.users);
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Authento
          </p>
        </header>
        <Form/>
        <List users={this.state.users}/>
      </div>
    );
  }
}

export default App;
