import React, { Component } from "react";
import "./App.css";
import LoginView from "./container/LoginView";
import { Route } from 'react-router-dom'
import RegisterView from "./container/RegisterView";

class App extends Component {
  render() {
    return (
      <div className="App">
        <Route exact path="/" component={LoginView} />
        <Route exact path="/register" component={RegisterView} />
      </div>
    );
  }
}

export default App;
