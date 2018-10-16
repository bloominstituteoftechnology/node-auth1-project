import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route } from "react-router-dom";
import "./index.css";
import App from "./components/App";
import Register from "./components/Register";
import Login from "./components/Login";
import Logout from "./components/Logout";
import Profile from "./components/Profile";
import Unauthorized from "./components/Unauthorized";
import * as serviceWorker from "./serviceWorker";

ReactDOM.render(
  <Router>
    <section className="mainRoutes">
      <Route exact path="/" component={App} />
      <Route path="/register" component={Register} />
      <Route path="/login" component={Login} />
      <Route path="/logout" component={Logout} />
      <Route path="/profile" component={Profile} />
      <Route path="/unauthorized" component={Unauthorized} />
    </section>
  </Router>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
