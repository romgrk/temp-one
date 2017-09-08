import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createLogger } from 'redux-logger';
import thunkMiddleware from 'redux-thunk';
import { createStore, applyMiddleware, compose } from 'redux';

import { rootReducer } from './reducers';
import {
} from './actions';
import App from './components/App';

import './styles.css';


const initialState = {}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const store =
  (process.env.NODE_ENV === 'production')
  ? createStore(rootReducer, initialState, composeEnhancers(applyMiddleware(thunkMiddleware)))
  : createStore(rootReducer, initialState, composeEnhancers(applyMiddleware(thunkMiddleware, createLogger())))

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.querySelector('#root')
)

if (module.hot) {
  module.hot.accept(['./reducers', './components/App'], () => {
    const NextApp = require('./components/App').default;
    render(
      <Provider store={store}>
        <NextApp />
      </Provider>,
      document.querySelector('#root')
    );
  });
}
