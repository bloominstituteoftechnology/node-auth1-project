import React from 'react';
import ReactDOM from 'react-dom';

import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import logger from "redux-logger";
import rootReducer from "./reducers";
import Root from './components/Root';

import registerServiceWorker from './registerServiceWorker';
import './index.css';

const reduxDevToolsHook = window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__();

const store = createStore(
    rootReducer,
    compose(applyMiddleware(logger, thunk), reduxDevToolsHook));



ReactDOM.render(<Root store={store} />, document.getElementById('root'));
registerServiceWorker();
