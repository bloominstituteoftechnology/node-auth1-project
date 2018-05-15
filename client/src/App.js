import React, { Component } from "react";
import axios from "axios";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

class App extends Component {
  constructor() {
    super();
    this.state = {
      Users: {}
    };
  }

  componentDidMount() {
    axios
      .post("http://localhost:8000/api/login").then()
      .get("http://localhost:8000/api/users")
      .then(response => {
        // this.setState({ Users: response.data });
        console.log(response);
      })
      .catch(err => {
        console.log(err);
      });
  }

  render() {
    return <div className="App">
      
      </div>
  }
}

export default App;
