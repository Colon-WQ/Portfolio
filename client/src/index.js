import React from 'react';
import ReactDOM from 'react-dom';
import Navbar from './components/navbar.component';
import Login from './components/login.component';
import LoginResult from './components/login-result.component';
import Dashboard from './components/dashboard.component';
import Home from './components/home.component';
import { createStore, applyMiddleware } from 'redux';
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers/root.reducer';
import reportWebVitals from './reportWebVitals';
import { theme } from './styles/styles';
import { ThemeProvider } from '@material-ui/core/styles';

const store = createStore(
  rootReducer,
  applyMiddleware(thunk)
)

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme = {theme}>
      <BrowserRouter>
        <Provider store = {store}>
          <Switch>
            <Route exact path = '/' component = {Home}></Route>
            <>
              <Navbar/>
              <Route exact path = '/login' component = {Login}></Route>
              <Route exact path = '/login/callback' component = {LoginResult}></Route>
              <Route exact path = '/dashboard' component = {Dashboard}></Route>
            </>
          </Switch>
        </Provider>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
