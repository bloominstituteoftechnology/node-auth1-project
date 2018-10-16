import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import Users from './components/Users';
import Login from './components/Login';
import * as serviceWorker from "./serviceWorker";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

ReactDOM.render(
  <Router>
    <React.Fragment>
      <Link style={{padding: '20px'}} to="/register">Register</Link>
      <Link style={{padding: '20px'}} to="/login">Login</Link>
      <Route path="/register" render={props => <App {...props} />} />
      <Route path="/users" render={props => <Users {...props} />} />
      <Route path="/login" render={props => <Login {...props} />} />
    </React.Fragment>
  </Router>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
