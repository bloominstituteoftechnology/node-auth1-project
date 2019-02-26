import React, { Component } from 'react';
import Axios from 'axios';

//Creates a react Context
const Context = React.createContext();
//URL for server
const dbURL = 'http://localhost:5000';

class Provider extends Component {
  state = {
    loggedIn: false,
    data: [],
  };

  registerUser = (e, user) => {
    e.preventDefault();
    Axios.post(`${dbURL}/api/register`, user)
      .then(res => {})
      .catch(err => console.log(err));
  };
  loginUser = (e, user) => {
    e.preventDefault();
    Axios.post(`${dbURL}/api/login`, user)
      .then(res => {
        this.setState({ loggedIn: true });
      })
      .catch(err => console.log(err));
  };

  render() {
    return (
      <Context.Provider
        value={{
          state: this.state,
          registerUser: this.registerUser,
          loginUser: this.loginUser,
        }}
      >
        {this.props.children}
      </Context.Provider>
    );
  }
}

export { Provider, Context };
