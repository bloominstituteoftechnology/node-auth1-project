import React, { Component } from 'react';
import logo from './logo.svg';

class App extends Component {
  constructor(){
    super();
    this.state = {
      newUser : {
        username : '',
        password : ''
      },
      loggedIn : false
    }
  }
  handleChange=e=>{
    this.setState({newUser : {...this.state.newUser,[e.target.name] : e.target.value }})
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <form className="login-form" onSubmit="#">

            <input 
            name="username" 
            className="input" 
            type="text" 
            placeholder="Username" 
            onChange={this.handleChange}
            />

            <input 
            name="password" 
            className="input" 
            type="password" 
            placeholder="Password" 
            onChange={this.handleChange}
            />

            <input className="input submit-btn" type="submit" />

          </form>
          
        </header>
        <p>Brought to you by gradients.</p>
      </div>
    );
  }
}

export default App;
