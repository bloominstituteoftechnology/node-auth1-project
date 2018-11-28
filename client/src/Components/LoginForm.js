import React from 'react';

const withLoggedIn = Component => props =>
  props.loggedIn
    ? <div>
      <span>Logged in 😎</span>
    </div>
    : <Component {...props} />

class LoginForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      creds: {
        username: '',
        password: ''
      }
    }
  }

  handleInput = event => {
    this.props.handleCreds(this.state.creds)
  }

  render() {
    return (
      <div>
        <input value={this.state.creds.username} onChange={this.handleInput}/>
        <input value={this.state.creds.password} onChange={this.handleInput}/>
              
      </div>
    )
  }
}

export default withLoggedIn(LoginForm);