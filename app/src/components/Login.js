import React from "react";
import axios from "axios";
class Login extends React.Component {
  state = {
    logginIn: false,
    errors: null,
    username: "doris",
    password: "12345678"
  };
  handleOnChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };
  handleLogin = e => {
    this.setState({ logginIn: true });
    axios
      .post("http://localhost:9000/api/login", {
        username: this.state.username,
        password: this.state.password
      })
      .then(resp => {
        if (resp.status === 201) {
          console.log(resp);
          this.setState({ logginIn: false });
          this.props.history.push("/users");
        }
        if (resp.status === 400) {
          this.setState({
            errors: resp.data.message,
            isLoggedIn: resp.data.isLoggedIn,
            logginIn: false
          });
        }
      })
      .catch(err => {
        console.log(err);
        this.setState({ errors: err, logginIn: false });
      });
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
        {this.state.logginIn ? (
          <h2>Logging In</h2>
        ) : (
          <React.Fragment>
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
          </React.Fragment>
        )}
      </div>
    );
  }
}

export default Login;
