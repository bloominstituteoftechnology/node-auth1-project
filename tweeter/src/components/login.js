import React from 'react';
import axios from 'axios';

class Login extends React.Component {
  state = {
    username: '',
    password: ''
  }
  changeHandler = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  }
  clickHandler = () => {
    axios
      .post('http://localhost:5000/log-in', this.state).then(res => {
        console.log(res);
      })
      .catch(err => console.log(err));
    
  }
  render() {
    return (
      <div className="login">
        <div className="login__title">Log In</div>
        <input 
          type="text" 
          name="username" 
          value={this.state.username} 
          placeholder="username"
          onChange={this.changeHandler}
        />
        <input 
          type="text" 
          name="password" 
          value={this.state.password} 
          placeholder="password"
          onChange={this.changeHandler}
        />
        <div className="login__submit-btn" onClick={this.clickHandler}>submit</div>
      </div>
    )
  }
}

export default Login;