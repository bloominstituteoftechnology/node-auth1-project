import React, { Component } from "react";
import { Link } from "react-router-dom";

class Home extends Component {
  state = {};
  render() {
    return (
      <div>
        <h2> Welcome to this page, or whatever.</h2>

        <h4>
          {" "}
          <Link to="/api/login">Log in here!</Link>
        </h4>
      </div>
    );
  }
}

export default Home;
