import React from 'react';
import ReactDOM from 'react-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import LoginResult from './components/LoginResult';
import Logout from './components/Logout';
import Dashboard from './components/Dashboard';
import Support from './components/Support/Support';
import Tutorial from './components/Tutorial/Tutorial';
import Portfolio from './components/Portfolio/Portfolio';
import Publish from './components/Portfolio/Publish';
import UserConfirmation from './components/UserConfirmation';
import ErrorDisplay from './components/ErrorDisplay';
import Faq from './components/Faq';
import { createStore, applyMiddleware } from 'redux';
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers/RootReducer';
import reportWebVitals from './reportWebVitals';
import { theme } from './styles/styles';
import { ThemeProvider } from '@material-ui/core/styles';


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

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme = {theme}>
      <BrowserRouter
        getUserConfirmation={(message, callback) => UserConfirmation(message, callback)}
      >
        <Provider store = {store}>
          <ErrorDisplay/>
          <Switch>
            <Route exact path = '/' component = {Home}></Route>
            <>
              <Navbar/>
                <Route exact path = '/login/callback' component = {LoginResult}></Route>
                <Route exact path = '/dashboard' component = {Dashboard}></Route>
                <Route exact path = '/edit' component = {Portfolio}></Route>
                <Route exact path = '/publish' component = {Publish}></Route>
                <Route exact path = '/logout' component = {Logout}></Route>
                <Route exact path = '/faq' component = {Faq}></Route>
                <Route exact path = '/support' component = {Support}></Route>
                <Route path = '/support/:id' component = {Support}></Route>
                <Route path = '/learn' component = {Tutorial}></Route>
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

export default store;