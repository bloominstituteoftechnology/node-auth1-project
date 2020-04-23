import React from 'react';
import { Route } from 'react-router-dom';
import LoginForm from './components/LoginForm'
import Navigation from './components/Navigation'
import SignupForm from './components/SignupForm'
import Home from './components/Home'
import UsersList from './components/UsersList'
import ProtectedRoute from './utils/ProtectedRoute'
import './App.css';

function App() {
  return (
    <div className="App">
      <Navigation />
      <ProtectedRoute exact path="/api/users" component={UsersList} />
      <Route exact path ="/" component={Home} />
      <Route exact path="/api/auth/register" component={SignupForm}/>
      <Route exact path="/api/auth/login" component={LoginForm} />
      
    </div>
  );
}

export default App;
