import React, { Component } from 'react';
import './App.css';
import styled from 'styled-components';
import axios from 'axios';

class App extends Component {
  constructor(){
    super();
    this.state = {
      loggedIn: false,
      username: '',
      regusername: '',
      password: '',
      regpassword: '',
    }
  }
  
  register = (event) => {
    event.preventDefault();
    axios.post('http://localhost:4500/register/', {
      "username": this.state.regusername, 
      "password": this.state.regpassword
    }).then(res => {
      if (res){
        this.setState({
          loggedIn: true, 
        })
      }
    }
    ).catch(err => console.log(err))
  }
  
  login = (event) => {
    event.preventDefault();
    axios.post('http://localhost:4500/login/', {
      "username": this.state.username, 
      "password": this.state.password
    }).then(res => {
      if (res){
        this.setState({
          loggedIn: true, 
        })
      }
    }
    ).catch(err => console.log(err))
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

        <div className="status">
          <p>Status: {this.state.loggedIn ? 'Logged in' : 'Please login or register'}</p>
        </div>
         
          <div className="login">
            <h4>Login</h4>
            <form onSubmit={this.login}>
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
          
          <div className="register">
          <h4>Register</h4>
          
          <form onSubmit={this.register}>
            <input
              required
              autoFocus
              onChange={this.inputHandler}
              name="regusername"
              value={this.state.regusername}
              // value={this.state.[this.name]}
              // can I do something like the above?
              placeholder="Name"
              type="text"
              >{this.value}</input>
            <input
              required
              onChange={this.inputHandler}
              name="regpassword"
              value={this.state.regpassword}
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
  .register, .login {
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