import React, { Component } from 'react';
import './App.css';
import Register from './components/Register';
import Login from './components/Login';
import { Route } from 'react-router-dom';
import axios from 'axios';

class App extends Component {
  state = {
    username: '',
    password: ''
  }

  changeHandler = (event) => {
    this.setState({[event.target.name]: event.target.value});
  }

  registerHandler = () => {
    axios
      .post('http://localhost:8000/api/register', this.state)
      .then(response => {
        console.log('response', response.data)
      })
      .catch(error => {
        console.log(error);
      })
  }

  loginHandler = () => {
    axios
      .post('http://localhost:8000/api/login')
      .then(response => {
        console.log('login response:', response.data)
      })
      .catch(error => {
        console.log(error);
      })
  }

  render() {
    return (
      <div className='App'>
        <Route 
          path="/api/register" 
          render={props => <Register {...props} 
          changeHandler={this.changeHandler} //onChange
          registerHandler={this.registerHandler} //form submit
          username={this.state.username} //username
          password={this.state.password} //password
        />}/>

        <Route
          path="/api/login"
          render={props => <Login {...props}
          changeHandler={this.changeHandler} //onChange
          loginHandler={this.loginHandler} //form submit
          username={this.state.username} //username
          password={this.state.password} //password
        />} />
      </div>
    );
  }
}

export default App;