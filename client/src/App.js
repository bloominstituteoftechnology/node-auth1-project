import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
// components
import Navigation from "./components/Navigation";
import RegistrationForm from "./components/RegistrationForm";
import UserProfile from "./components/UserProfile";
import Users from "./components/Users";
// material components
import AppBar from "material-ui/AppBar";

// styles
import logo from "./logo.svg";
import "./styles/App.css";

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <Navigation />
        {/* Application Routes */}
        <Switch>
          <Route exact path="/" component={RegistrationForm} />
          <Route path="/userprofile" component={UserProfile} />
          <Route path="/users" component={Users} />
        </Switch>
      </div>
    );
  }
}

export default App;
