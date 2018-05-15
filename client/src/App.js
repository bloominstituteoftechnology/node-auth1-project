import React, { Component } from "react";
import "./App.css";
import { Route } from "react-router";
import Login from "./Login";

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Authentication</h1>
        </header>
        <Route path="/login" component={Login} />
      </div>
    );
  }
}

export default App;
