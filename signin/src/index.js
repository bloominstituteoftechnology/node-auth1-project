import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import Login from './Login';
import SignUp from './SignUp';
import UserPage from './UserPage';

ReactDOM.render(
  <BrowserRouter>
     <Route exact path="/" component={App} />
     <Route path="/login" component={Login} />
     <Route path="/signup" component={SignUp} />
     <Route path="/users" component={UserPage} />
  </BrowserRouter>,
  document.getElementById('root')
);







(<App />, document.getElementById('root'));
registerServiceWorker();
