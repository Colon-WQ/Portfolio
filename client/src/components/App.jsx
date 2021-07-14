import React from 'react';
import Navbar from './Navbar';
import Home from './Home';
import LoginResult from './LoginResult';
import Logout from './Logout';
import Dashboard from './Dashboard';
import Support from './Support/Support';
import SupportPages from './Support/SupportPages';
import Tutorial from './Tutorial/Tutorial';
import Portfolio from './Portfolio/Portfolio';
import Publish from './Portfolio/Publish';
import UserConfirmation from './UserConfirmation';
import ErrorDisplay from './ErrorDisplay';
import Faq from './Faq';
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { Provider } from 'react-redux';
import { lightTheme, darkTheme } from '../styles/styles';
import { ThemeProvider } from '@material-ui/core/styles';
import { Component } from 'react';


/**
 * @file App.jsx contains the routes for the app
 * 
 * @author Chen En
 * @author Chuan Hao
 */

class App extends Component {
  constructor() {
    super();
    this.state = {
      lightMode: true,
    }
    this.handleToggleLight = this.handleToggleLight.bind(this);
  }

  handleToggleLight() {
    this.setState({ lightMode: !this.state.lightMode })
  }

  render() {
    return (
      <ThemeProvider theme={this.state.lightMode ? lightTheme : darkTheme}>
        <BrowserRouter
          getUserConfirmation={(message, callback) => UserConfirmation(message, callback)}
        >
          <Provider store={this.props.store}>
            <ErrorDisplay />
            <Switch>
              <Route exact path='/' component={Home}></Route>
              <>
                <Navbar toggleLight={this.handleToggleLight} />
                <Route exact path='/login/callback' component={LoginResult}></Route>
                <Route exact path='/dashboard' component={Dashboard}></Route>
                <Route exact path='/edit' component={Portfolio} theme={this.state.lightMode ? lightTheme : darkTheme}></Route>
                <Route exact path='/publish' component={Publish}></Route>
                <Route exact path='/logout' component={Logout}></Route>
                <Route exact path='/faq' component={Faq}></Route>
                <Route exact path='/support' component={Support}></Route>
                <Route path='/support/:id' component={SupportPages}></Route>
                <Route path='/learn' component={Tutorial}></Route>
              </>
            </Switch>
          </Provider>
        </BrowserRouter>
      </ThemeProvider>
    );
  }
}

export default App;
