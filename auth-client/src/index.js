import React from "react";
import ReactDOM from "react-dom";
// import './index.css';
// import "bootstrap/dist/css/bootstrap.min.css";
import * as serviceWorker from "./serviceWorker";
import { Route, BrowserRouter as Router, NavLink } from "react-router-dom";
import Login from "./App";
import Register from "./Register";

const routing = (
  <Router>
    <div>
        
      {/* TODO: Replace APP with HOME/Marketing */}
      {/* <Route exact path="/" component={App} /> */}

      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />

    </div>
  </Router>
);

ReactDOM.render(routing, document.getElementById("root"));

serviceWorker.unregister();