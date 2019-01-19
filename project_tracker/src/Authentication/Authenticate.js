import React from "react";
import Login from "../components/Login/Login.js";
import axios from "axios";

const Authenticate = App => {
  return class extends React.Component {
    constructor() {
      super();
      this.state = {
        loggedIn: false
      };
    }
    componentDidMount() {
      axios
        .get("http://localhost:3300/api/restricted/users")
        .then(res => {
          console.log(res);
          this.setState({
            loggedIn: true
          });
        })
        .catch(err => {
          console.log(err);
        });
    }

    render() {
      if (this.state.loggedIn) {
        return <App />;
      } else return <Login />;
    }
  };
};

export default Authenticate;
