import React, { useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";
import { Route } from "react-router-dom";
import Login from "./components/Login";
import axios from "axios";
import Users from "./components/Users";
function App() {
  useEffect(() => {
    axios
      .get("https://nodewithsession.herokuapp.com/api/users")
      .then(res => {
        console.log(res);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);
  return (
    <div className="App">
      <Route eaxct path="/" render={props => <Login {...props} />} />
      <Route path="/users" render={() => <Users />} />
    </div>
  );
}

export default App;
