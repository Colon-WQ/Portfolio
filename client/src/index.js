import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers/RootReducer';
import reportWebVitals from './reportWebVitals';
import App from './components/App';


/**
 * @file index.js is the root file for this Portfol.io app
 * 
 * @author Chen En
 * @author Chuan Hao
 */
const store = createStore(
  rootReducer,
  applyMiddleware(thunk)
)


// document.getElementsByTagName('html')[0].style.height = '100%'
// document.getElementsByTagName('body')[0].style.height = '100%'


ReactDOM.render(
  <React.StrictMode>
    <App store={store}/>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

export default store;