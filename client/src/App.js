import React, { Component } from "react";
import Login from "./components/Login";

import { Route, withRouter } from "react-router-dom";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      users: []
    };
  }

  componentDidMount() {}

  render() {
    return (
      <div>
        <Login />
      </div>
    );
  }
}

export default withRouter(App);
