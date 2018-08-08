import React from "react";
import axios from "axios";
import User from "./User";

class Users extends React.Component {
  constructor() {
    super();
    this.state = {
      users: []
    };
  }
  componentDidMount() {
    axios.defaults.withCredentials = true;
    axios
      .get("http://localhost:8000/api/users")
      .then(response => this.setState({ users: response.data, loggedin: true }))
      .catch(err => console.log(err.response));
  }
  logoutButton = event => {
    event.preventDefault();
    axios
      .get("http://localhost:8000/api/logout")
      .then(response => {
        this.props.history.push("/");
      })
      .catch(err => {
        console.log(err);
      });
  };
  render() {
    console.log("response.data after render is: ", this.state.users);
    return (
      <div>
        <button onClick={this.logoutButton}>Logout</button>
        {this.state.users.map(user => {
          return (
            <div>
              <User user={user} />
            </div>
          );
        })}
      </div>
    );
  }
}

export default Users;
