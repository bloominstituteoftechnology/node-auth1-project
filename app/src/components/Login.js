import React from "react";
import axios from "axios";
class Login extends React.Component {
  state = {
    isLoggedIn: false,
    errors: null,
    username: "doris",
    password: "12345678"
  };
  handleOnChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };
  handleLogin = e => {
    axios.post("http://localhost:9000/api/login", {
      username: this.state.username,
      password: this.state.password
    })
    .then(resp => {
      if(resp.status === 201) {
        this.setState({isLoggedIn: resp.data.isLoggedIn});
        this.props.history.push('/users');
      }
      if(resp.status === 400) {
        this.setState({errors: resp.data.message, isLoggedIn: resp.data.isLoggedIn})
      }
    })
    .catch(err => {
      console.log(err);
      this.setState({errors: err});
    })
  };
  render() {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column"
        }}
      >
        <h1>Login Here</h1>
        <h4>
          Thanks for registering! Please take one more step to login, and
          witness history!!
        </h4>
        <div>
          <label>Username: </label>
          <input
            onChange={this.handleOnChange}
            type="text"
            name="username"
            defaultValue="doris"
          />{" "}
          <br />
        </div>
        <div>
          <label>Password: </label>
          <input
            onChange={this.handleOnChange}
            type="password"
            name="password"
            defaultValue="12345678"
          />
        </div>
        <br />
        <button type="submit" onClick={this.handleLogin}>
          Login
        </button>
      </div>
    );
  }
}

export default Login;
