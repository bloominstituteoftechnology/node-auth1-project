import React, { useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";
import Login from "./components/Login";
import axios from "axios";

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
  console.log("wefewf");
  return (
    <div className="App">
      <Login />
    </div>
  );
}

export default App;
