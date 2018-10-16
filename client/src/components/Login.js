import React from 'react';
import axios from 'axios';

class Login extends React.Component {
  state = {
    username: '',
    password: '',
  };

  changeHandler = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  clickHandler = e => {
    e.preventDefault();

    const user = { ...this.state };

    axios
      .post('http://localhost:4400/api/login', user)
      .then(response => {
        this.props.updateUser();
      })
      .catch(err => console.log(err));
  };

  render() {
    return (
      <div>
        <h3>Login</h3>
        <form>
          <input
            name="username"
            placeholder="Username"
            value={this.state.username}
            onChange={this.changeHandler}
          />
          <input
            name="password"
            placeholder="Password"
            value={this.state.password}
            onChange={this.changeHandler}
          />
          <button onClick={this.clickHandler}>Log In</button>
        </form>
      </div>
    );
  }
}

export default Login;
