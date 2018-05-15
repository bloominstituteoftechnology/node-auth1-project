import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import './App.css';
import axios from 'axios';
import Login from './login';
import Register from './register';
import Users from './users';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      username: '',
      password: ''
    };
  }

  
  // componentDidMount() {
  //   axios
  //     .get(`http://localhost:5000/api/restricted/users`)
  //     .then(response => {
  //       this.setState({ users: response.data })
  //     })
  //     .catch(err => {
  //       console.log(err);
  //     })
  // }
  
  
  render() {
    return (
      <div className="App">
     <Route exact path='/register' component={Register} />
     <Route exact path='/' component={Login} />
     <Route exact path='/users' component={Users}/>
      </div>
    );
  }
}

export default App;
