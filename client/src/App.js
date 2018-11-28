import React, { Component } from 'react';
import './App.css';
import Register from './components/Register';
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
  submitHandler = (e) => {
    axios
      .post('http://localhost:8000/api/register', this.state)
      .then(response => {
        console.log('response', response.data)
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
          submitHandler={this.submitHandler} //form submit
          username={this.state.username} //username
          password={this.state.password} //password
        />}/>
      </div>
    );
  }
}

export default App;