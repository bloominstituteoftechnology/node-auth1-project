import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import {createStore, applyMiddleware, compose} from 'redux';
import {Provider} from 'react-redux';

import rootReducer from './reducers';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(rootReducer,
  composeEnhancers(applyMiddleware(thunk, logger))
);

ReactDOM.render(
<Provider store={store}>
    <App />
</Provider>,
document.getElementById('root')
);

