import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import styled from 'styled-components';
import axios from 'axios';

class App extends Component {
  constructor(){
    super();
    this.state = {
      loggedIn: false,
      username: '',
      password: '',
    }
  }
  
  register = (e) => {
    e.preventDefault();
    console.log('register')
    axios.post('http://localhost:4500/new').then(
      this.setState({
        loggedIn: false, 
      })
    )
  }

  inputHandler = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    })
  }

  render() {
    return (
      <div className="App">
        <AppDiv>
          <div className="register">
          <h4>Register</h4>
          
          <form onSubmit={this.register}>
            <input
              required
              autoFocus

              onChange={this.inputHandler}
              name="username"
              value={this.state.username}
              // value={this.state.[this.name]}
              // can I do something like the above?
              placeholder="Name"
              type="text"
              >{this.value}</input>
            <input
              required
              onChange={this.inputHandler}
              name="password"
              value={this.state.password}
              placeholder="Password"
              type="password"></input>
            <button>BUTTON</button>
          </form>
          </div>
          
        </AppDiv>
      </div>
    );
  }
}

export default App;

const AppDiv = styled.div`
  border: 1px solid red;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .register {
    width: 350px;
    border: 1px solid blue;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    form{
      width: 300px;
      display: flex;
      flex-direction: column;
    }
  }
`;