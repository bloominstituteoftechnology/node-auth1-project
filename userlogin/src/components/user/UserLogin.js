import React, { Component } from 'react';
import './User.css'

class UserLogin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      
    }
  }

  handleChange = (e) => {
    this.setState({[e.target.name]: e.target.value});
  }

  handleSubmitLogin = () => {
    alert("User Login");
    this.setState({username: '', password: ""});
  };

  handleSubmitRegister = () => {
    alert("User Register");
    this.setState({username: '', password: ""});
  };

  render() { 
    return ( 
      <div className="User">
        <div className="User-title">
          User Login
        </div>
        <div className="User-input">
          <input name='username' type="text" onChange={this.handleChange} value={this.state.username} placeholder="Username" />
        </div>
        <div className="User-input">
        <input name='password' type="password" onChange={this.handleChange} value={this.state.password} placeholder="Password"/>
        </div>
        <button className="User-button" onClick={this.handleSubmitLogin}>Login</button>
        <div className="User-title">
          Not Register Yet?          
        </div>
        <button className="User-button" onClick={this.handleSubmitRegister}>Register</button>
      </div>
     )
  }
}
 
export default UserLogin;
