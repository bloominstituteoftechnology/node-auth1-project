import React, { Component } from 'react';

//Context Store
import { Provider, Context } from './Context/Provider';

import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';

class App extends Component {
  render() {
    return (
      <Provider>
        <div className="App">
          <Context.Consumer>
            {context => (
              <>
                {context.state.loggedIn ? (
                  <h1>Welcome to the app!</h1>
                ) : (
                  <>
                    <LoginForm />
                    <RegisterForm />
                  </>
                )}
              </>
            )}
          </Context.Consumer>
        </div>
      </Provider>
    );
  }
}

export default App;
