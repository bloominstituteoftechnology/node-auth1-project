import React, { Component } from "react";
import "./App.css";

import { Route, withRouter } from "react-router-dom";
import axios from "axios";

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
        <p>Hi 👋🏼</p>
      </div>
    );
  }
}

export default withRouter(App);
