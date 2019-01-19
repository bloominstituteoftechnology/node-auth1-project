import React, { Component } from "react";
import "./App.css";
import Authenticate from './Authenticate/Authenticate'
import Users from "./Users/users";


const App = (

  class App extends Component {
    constructor() {
      super()
      this.state = {}
    }

    render() {


      return (
        <div className='App'>

<Users />
        </div>
      );
    }
  }
);

export default Authenticate(App);
