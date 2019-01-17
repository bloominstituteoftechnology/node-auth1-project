import React, { Component } from "react";
import "./App.css";
import Authenticate from './Authenticate/Authenticate'


const App = (

  class App extends Component {
    constructor() {
      super()
      this.state = {}
    }

    render() {


      return (
        <div className='App'>

          <h1>Users</h1>

        </div>
      );
    }
  }
);

export default Authenticate(App);
