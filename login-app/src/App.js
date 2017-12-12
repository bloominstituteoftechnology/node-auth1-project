import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import AccountCreate from './AccountCreate';
import Login from './Login';
import UserComponent from './UserComponent';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      login: false,
      createAccount: true,
      me: false
    };
    this.toggleLogin = this.toggleLogin.bind(this);
    this.showMe = this.showMe.bind(this);
  }
  toggleLogin(componentName) {
    if (componentName === 'createAccount') {
      this.setState({ login: true, createAccount: false });
    }
    if (componentName === 'login') {
      this.setState({ login: false, createAccount: true });
    }
  }
  showMe() {
    this.setState({ login: false, createAccount: false, me: true });
  }
  render() {
    return (
      <div className="App">
        <header className="App-header" />
        {this.state.login ? (
          <Login showMe={this.showMe} toggleLogin={this.toggleLogin} />
        ) : null}
        {this.state.createAccount ? (
          <AccountCreate toggleLogin={this.toggleLogin} />
        ) : null}
        {this.state.me ? <UserComponent /> : null}
      </div>
    );
  }
}

export default App;
