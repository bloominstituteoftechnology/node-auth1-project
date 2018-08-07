import React from 'react';
import Login from './Login';

const Authentication = App =>
  class extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        loggedIn: false
      }
    }
    componentDidMount() {
      if (!sessionStorage.getItem('fakeCookie')) {
        this.setState({loggedIn: false});
      } else {
        this.setState({loggedIn: true});
      }
    }

    render() {
      if (this.state.loggedIn) return <App/>;
      return <Login />;
    }
  }


export default Authentication;
