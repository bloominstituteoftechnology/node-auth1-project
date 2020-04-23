import React from "react";
import { Switch, Route } from "react-router-dom";
import logo from "./logo.svg";

import Login from "./components/login";
import Dashboard from "./components/dashboard";
import Register from "./components/register";

function App() {
  return (
    <div className="App ">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Node Auth-1 Project</p>
      </header>
      <main className="container">
        <Switch>
          <Route exact path="/" component={Login} />
          <Route exact path="/dashboard" component={Dashboard} />
          <Route exact path="/register" component={Register} />
        </Switch>
      </main>
    </div>
  );
}

export default App;
