import React from "react";
import { Link } from "react-router-dom";
import { withRouter} from 'react-router';
import axios from "axios";
class Login extends React.Component {
  state = {
    username: "",
    password: "",
    errorHeader: ""
  };

  login = loginBody => {
    const promise = axios.post("http://localhost:9000/api/login", loginBody);
    promise
      .then(response => {
        if(response){
          console.log(response)
          return this.props.history.push("/")
        }
      })
      .catch(error => {
        console.error(error)
      })
  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  onSubmit = () => {
    let errorHeader = "";
    if (this.state.password.length < 10) {
      errorHeader = "Username or password is invalid!-";
    }
    if (!this.state.username.length) {
      errorHeader = "Username or password is invalid!-";
    }
    if (errorHeader.length) {
      this.setState({ errorHeader });
    } else {
      this.login({
        username: this.state.username.slice(),
        password: this.state.password.slice()
      });
    }
  };

  render() {
    const errors = this.state.errorHeader.split("-");
    return (
      <div>
        {errors.map((error, i) => {
          <p key={i}>{error}</p>;
        })}
        <br />
        <label>Username:</label>
        <input
          onChange={this.onChange}
          name = "username"
          value={this.state.username}
          type="text"
          placeholder="Enter Username:"
        />
        <br />
        <label>Password :</label>
        <input
          onChange={this.onChange}
          name ="password"
          value={this.state.password}
          type="password"
          placeholder="Enter Password:"
        />
        <br />
        <button onClick = {this.onSubmit}> <Link to="/">Login</Link></button>
        <br />
        <Link to="/register">Register</Link>
      </div>
    );
  }
}

export default withRouter(Login);
