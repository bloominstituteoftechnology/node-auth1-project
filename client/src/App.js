import React from 'react'
import {Route} from 'react-router-dom';
import Users from './components/Users';
import Signup from './components/Signup';
import Login from './components/Login';

const App = () => {
  return (
    <div className="App">

      <Route exact path='/' 
        render={(props) => (
          <Users {...props} />
        )} 
      />

      <Route path='/signup' 
        render={(props) => (
          <Signup {...props} />
        )} 
      />

      <Route path='/login' 
        render={(props) => (
          <Login {...props} />
        )} 
      />

    </div>
  )
}

export default App;