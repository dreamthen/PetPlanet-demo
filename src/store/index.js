import {createStore, applyMiddleware, compose} from 'redux';
import thunkMiddleware from 'redux-thunk';
import loggerMiddleware from 'redux-logger';
// import {persistState} from 'redux-devtools';
import rootReducer from '../reducers';

let middlewares = [];

if (process.env.NODE_ENV === 'development') {
  middlewares = [...middlewares, thunkMiddleware, loggerMiddleware];
} else {
  middlewares = [...middlewares, thunkMiddleware];
}

const store_compose = compose(
  applyMiddleware(...middlewares)
  // persistState(window.location.href.match(/[?&]debug_sessions=([^&]+)\b/))
)(createStore);

const store = store_compose(rootReducer, {});

export default store;
