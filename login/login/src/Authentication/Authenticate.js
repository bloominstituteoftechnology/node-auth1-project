import React from 'react';
import LoginPage from '../Login/Login.js';

const Authenticate = App =>
  class extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        loggedIn: false
      };
    }
    componentDidMount() {
      console.log(document.cookie)
      if(document.cookie === false) {
        this.setState({ loggedIn: true })
      } 
    }
    render() {
      if (this.state.loggedIn) return <App />;
      return <LoginPage />
    }
  };

export default Authenticate;
