import React from 'react';
import './App.css';
import Login from './components/Login';
import Users from './components/Users';
import { Route, Redirect } from 'react-router-dom';

const ProtectedRoute = ({component: Component, ...rest}) => {
  return <Route {...rest} render={props => {
    if (localStorage.getItem('token')) {
      return <Component {...props} />
    } else {
      return <Redirect to="/login" />
    }
  }} />
}

function App() {
  return (
    <div className="App">
      Let's Gooooo.
      <Route path="/login" component={Login} />
      <ProtectedRoute path="/users" component={Users} />
    </div>
  );
}

export default App;
