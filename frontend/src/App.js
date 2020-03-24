import React from "react";
import logo from "./logo.svg";
import "./App.css";
import Login from "./components/Login";
import Register from "./components/Register";
import Secret from "./components/Secret";
import { Switch, Route } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Switch>
        <Route exact path="/">
          <Login />
        </Route>

        <Route path="/register">
          <Register />
        </Route>

        <Route path="/secret">
          <Secret />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
