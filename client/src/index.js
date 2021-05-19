import React from 'react';
import ReactDOM from 'react-dom';
import Navbar from './components/navbar.component';
import Login from './components/login.component';
import LoginResult from './components/login-result.component';
import Dashboard from './components/dashboard.component';
import Home from './components/home.component';
import { createStore, applyMiddleware } from 'redux';
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers/root.reducer';
import reportWebVitals from './reportWebVitals';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

const store = createStore(
  rootReducer,
  applyMiddleware(thunk)
)

//visit here to see what to override 
//https://material-ui.com/customization/default-theme/
const theme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      light: '#98F9FF',
      main: '#98E0FF',
      dark: '#0012C4'
    },
    secondary: {
      light: '#E0B0FE',
      main: '#B033FF',
      dark: '#4E0080'
    },
    text: {
      primary: 'rgba(255, 255, 255, 0.87)',
      secondary: 'rgba(0, 0, 0, 0.87)'
    }
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto'
    ].join(',')
  }
})

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme = {theme}>
      <BrowserRouter>
        <Provider store = {store}>
          <Navbar></Navbar>
          <Switch>
            <Route exact path = '/' component = {Home}></Route>
            <Route exact path = '/login' component = {Login}></Route>
            <Route exact path = '/login/callback' component = {LoginResult}></Route>
            <Route exact path = '/dashboard' component = {Dashboard}></Route>
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
