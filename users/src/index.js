import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Login from './components/Login'
import { BrowserRouter as Router, Route} from 'react-router-dom';


ReactDOM.render(
<Router>
    <div>
        <Route path='/' component={App}/>
        <Route exact path="/login" component={Login} />
    </div>
</Router>, document.getElementById('root'));


