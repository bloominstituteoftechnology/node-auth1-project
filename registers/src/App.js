import React, { Component } from "react";
import { BrowserRouter as Router, Link, Route } from "react-router-dom";
import "./App.css";
import Form from "./formSection.js";
import UsersView from "./usersView.js";
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: []
    };
  }
  render() {
    return (
      <Router>
        <div className="App">
          <div>
            <Route path="/" exact component={Form} />
          </div>
          <div>
            <Route exact path="/users" component={UsersView} />
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
