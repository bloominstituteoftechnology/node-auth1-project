import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      register: {
        username: '',
        password: ''
      },
      login: {
        username: '',
        password: ''
      }
    }

  }
  render() {
    return (
  <div>    
     <form onSubmit={this.handleSubmit}>
       <input
          type="text"
          name="username"
          id="username"
          placeholder="Username"
          onChange={this.handleChange}
          onSubmit={this.handleSubmit}
          value={this.state.username} />
        <input 
          type="text"
          name="password"
          id="password"
          placeholder="Password"
          onChange={this.handleChange}
          onSubmit={this.handleSubmit}
          value={this.state.password} />
        </form>
        <button onClick={this.handleSubmit}> Register </button>
    </div>
    );
  }
}
// You were dragging things from your components and moving them over here to test if it was an issue with the server restarting (the fact that the cookie wasn't working)

export default App;
