import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import {usersReducer} from './reducers/reducers';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import { createStore } from 'redux';
import { Provider } from 'react-redux';
const store = createStore(usersReducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider >,
    document.getElementById('root'))

// registerServiceWorker();
