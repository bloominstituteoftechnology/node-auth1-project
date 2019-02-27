import React, { Component } from 'react';
import Axios from 'axios';
Axios.defaults.withCredentials = true;

//Creates a react Context
const Context = React.createContext();
//URL for server
const dbURL = 'http://localhost:5000';

class Provider extends Component {
  state = {
    loggedIn: false,
    data: [],
  };

  render() {
    return (
      <Context.Provider
        value={{
          state: this.state,
          registerUser: this.registerUser,
          loginUser: this.loginUser,
          getRestricted: this.getRestricted,
        }}
      >
        {this.props.children}
      </Context.Provider>
    );
  }
  //Axios calls
  registerUser = (e, user) => {
    const register = Axios.create({ withCredentials: true });
    e.preventDefault();
    register
      .post(`${dbURL}/api/register`, user)
      .then(res => {})
      .catch(err => console.log(err));
  };

  loginUser = (e, user) => {
    const login = Axios.create({ withCredentials: true });
    e.preventDefault();
    login
      .post(`${dbURL}/api/login`, user)
      .then(res => {
        this.getRestricted();
      })
      .catch(err => console.log(err));
  };

  getRestricted = () => {
    const restricted = Axios.create({ withCredentials: true });
    restricted
      .get(`${dbURL}/api/restricted`)
      .then(res => {
        this.setState({
          data: res.data,
          loggedIn: true,
        });
        return;
        console.log(this.state.data);
      })
      .catch(err => console.log(err));
  };
}

export { Provider, Context };
