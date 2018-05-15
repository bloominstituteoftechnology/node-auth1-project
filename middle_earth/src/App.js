import React, { Component } from 'react';
import axios from 'axios'
import logo from './logo.svg';
import './App.css';

class App extends Component {
  state={
  }

  render() {
    return (<React.Fragment>
      <Route path="/login" component={login} />
   <Route component={checkedLoggedIn}>
   <Route path="/users" component={users}/>
   </Route>
   </React.Fragment> );
  }
}

export default App;
