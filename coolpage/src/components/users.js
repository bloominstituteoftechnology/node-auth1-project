import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

class Login extends Component {
  constructor() {
    super();
    this.state = {
      users: []
    };
  }
//   componentDidMount() {
//     axios
//       .get("http://localhost:3000/users")
//       .then(res => {
//         this.setState({ users: res.data });
//       })
//       .catch(error => {
//         console.error("Server Error", error);
//       });
//   }

  getUsers() {
    axios
      .get("http://localhost:3000/users")
      .then(res => {
        this.setState({ users: res.data });
      })
      .catch(error => {
        console.error("Server Error", error);
      });
  }

  render() {
      this.getUsers()
    return (
      <div>
        <div>
          {this.state.users.map(user => 
            <div>{user.username}</div> )}
        </div>
        {this.state.users.length === 0 ? <Link to="/login"><button>log in</button></Link> : <Link to="/login"><button>log out</button></Link>}
      </div>
    );
  }
}

export default Login;
