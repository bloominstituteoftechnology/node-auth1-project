import React, { useState } from 'react'

//imports
import { BrowserRouter as Router } from 'react-router'

//components
import Login from './Compoments/LogIn';
import User from './Compoments/User';

//context
import { appContext } from './context/appContext';

export default function App() {


  const [loggedIn, setLoggedIn ] = useState(false)


  return (
    <appContext.Provider  value ={{
      loggedIn: loggedIn,
      setLoggedIn: setLoggedIn
    }}>
      <div className = 'App'>
          {
              !loggedIn?
              <Login/>:
              <User/>
          }
      </div>
    </appContext.Provider>
  )
}
