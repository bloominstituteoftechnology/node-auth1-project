import React from "react";
import axios from "axios";

class Register extends React.Component {
  constructor() {
    super();
    this.state = {
      user: "",
      password: ""
    };
  }
  addAccount = event => {
    this.setState({ [event.target.name]: event.target.value });
  };
  submitAccount = e => {
    e.preventDefault();
    const newUser = { user: this.state.user, password: this.state.password };
    axios.defaults.withCredentials = true;
    axios
      .post("http://localhost:8000/api/register", newUser)
      .then(response => {
        this.props.history.push("/");
        this.setState({ user: "", password: "" });
      })
      .catch(err => {
        console.log(err);
      });
  };

  render() {
    return (
      <div>
        <h1>Create an account below</h1>
        <form>
          <input
            type="text"
            onChange={this.addAccount}
            name="user"
            placeholder="create a username..."
          />
          <input
            type="password"
            onChange={this.addAccount}
            name="password"
            placeholder="create a pssword..."
          />
          <button onClick={this.submitAccount}>Create</button>
        </form>
      </div>
    );
  }
}

export default Register;
