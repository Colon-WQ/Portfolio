import React, { Component } from 'react';
import { connect } from 'react-redux';
import { log_out_user, repopulate_state } from '../actions/LoginAction';
import { clearCurrentWorkFromLocal } from '../actions/PortfolioAction';
import axios from 'axios';
import AppBar from '@material-ui/core/AppBar';
import ToolBar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import CssBaseline from '@material-ui/core/CssBaseline';
import List from '@material-ui/core/List';
import { handleErrors } from '../handlers/errorHandler';
import { withStyles } from '@material-ui/core/styles';
import { Avatar, Box, Button, Divider, Drawer, Hidden, IconButton } from '@material-ui/core';
import { withRouter } from 'react-router-dom';
import { ReactComponent as ResumateSVG } from '../res/assets/resumate3.svg';
import { FaEdit } from 'react-icons/fa';

/**
 * @file Home component serves as a welcome page to users and provides functionalities that allow
 * user's to login via Github Oauth.
 * 
 * @author Chuan Hao
 * 
 * @see Navbar
 */

// TODO: clean up unused styles
/**
 * Style generator to dynamically adjust styles based on theme provided
 * 
 * @memberof Navbar
 * @param {Object} theme 
 */
const styles = (theme) => ({
  root: {
    display: 'flex'
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    backgroundColor: `${theme.palette.primary.main}aa`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginRight: theme.spacing(30),
    width: `calc(100% - ${theme.spacing(30)})`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  homeButton: {
    marginRight: 'auto',
  },
  homeButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
  },
  drawerDiv: {
    display: 'block',
    justifyContent: 'center',
    textAlign: 'center',
    height: '100vh',
  },
  drawerPaper: {
    whiteSpace: 'nowrap',
    width: theme.spacing(30),
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(0),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(0),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: 240,
  },
  hide: {
    display: 'none'
  },
  expandedAvatar: {
    marginTop: theme.spacing(5),
    height: theme.spacing(20),
    width: theme.spacing(20),
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  maxWidthButton: {
    width: '100%',
    borderRadius: '0px'
  },
  maxHeight: {
    height: '100%',
  },
  flexDown: {
    display: 'flex',
    flexDirection: 'column',
  },
  logoutButton: {
    color: theme.palette.error.main,
    '&:hover': {
      backgroundColor: theme.palette.error.dark
    }
  },
  dashboardButton: {
    color: theme.palette.error.main,
    '&:hover': {
      backgroundColor: theme.palette.error.dark
    }
  }
});


/**
 * Navbar component for page navigation.
 * 
 * @author Chen En
 * @author Chuan Hao
 * 
 * @component
 */
class Navbar extends Component {
  /**
   * @constructor
   * fixes default fields in state
   */
  constructor() {
    super();
    this.handleLogout = this.handleLogout.bind(this);
    this.handleUserMenu = this.handleUserMenu.bind(this);
    this.state = {
      menu_open: false,
      user_drawer_open: false
    }

    this.handleLogout = this.handleLogout.bind(this);
    this.handleReturnDashboard = this.handleReturnDashboard.bind(this);
    this.handleUserMenu = this.handleUserMenu.bind(this);
    this.handleReturnHome = this.handleReturnHome.bind(this);
  }

  /**
   * Attempts to fetch user info to display in the component.
   * 
   * @return void
   * @memberof Navbar
   */
  async componentDidMount() {
    if (!this.props.loggedIn) {
      const localStorageItem = await JSON.parse(window.localStorage.getItem(process.env.REACT_APP_USER_LOCALSTORAGE))
      if (localStorageItem !== null) {
        await this.props.repopulate_state(localStorageItem);
      }
    }
  }

  /**
   * Logout function to clear cookies and invalidate the github authorization.
   * 
   * @return void
   * @memberof Navbar
   */
  async handleLogout() {
    console.log("logging out")
    this.props.log_out_user()
    this.props.clearCurrentWorkFromLocal();
    localStorage.removeItem(process.env.REACT_APP_USER_LOCALSTORAGE)
    console.log("successfully cleared localStorage")
    await axios({
      method: 'GET',
      url: process.env.REACT_APP_BACKEND + '/logout',
      withCredentials: true
    }).then(res => {
      this.props.history.push("/");
    }).catch(err => {
      handleErrors(err, this.props.history);
    })
  }

  /**
   * Function to return user to the Dashboard
   * 
   * @return void
   * @memberof Navbar
   */
  handleReturnDashboard() {
    this.props.history.push("/dashboard");
    this.handleUserMenu();
  }

  /**
   * Function to return user to the homepage.
   * 
   * @return void
   * @memberof Navbar
   */
  handleReturnHome() {
    this.props.history.push("/")
    this.handleUserMenu();
  }


  /**
   * Logout function to clear cookies and invalidate the github authorization.
   * 
   * @return void
   * @memberof Navbar
   */
  handleUserMenu() {
    this.setState({ user_drawer_open: !this.state.user_drawer_open });
  }

  render() {

    const { loggedIn, name, id, avatar_url, gravatar_id, error } = this.props

    if (error) {
      return <div>Error! {error.message}</div>
    }

    const { classes } = this.props;

    // CssBaseline gets the default body style and applies it (background colour etc.)
    return (
      <div className={classes.root}>
        <CssBaseline />
        <AppBar position="fixed"
          className={this.state.user_drawer_open
            ? `${classes.appBar} ${classes.appBarShift}`
            : classes.appBar}>
          <ToolBar className={classes.toolbar}>
            <IconButton className={classes.homeButton} onClick={this.handleReturnHome}>
              <ResumateSVG width="1em" height="1em" />
              <Typography component="h1" variant="h6" color="inherit" fontWeight="bold" noWrap className={classes.title}>
                <Box fontWeight="bold">Resu<span style={{ color: "#FF0000" }} >mate</span></Box>
              </Typography>
            </IconButton>
            <Button startIcon={<Avatar src={avatar_url} />}
              onClick={this.handleUserMenu}
              className={loggedIn && !this.state.user_drawer_open ? "" : classes.hide}>
              {name}
            </Button>
          </ToolBar>
        </AppBar>
        <Drawer
          variant="temporary"
          anchor="right"
          onBackdropClick={this.handleUserMenu}
          classes={{
            paper: this.state.user_drawer_open
              ? classes.drawerPaper
              : `${classes.drawerPaper} ${classes.drawerPaperClose}`
          }}
          open={this.state.user_drawer_open}
        >
          <div className={classes.drawerDiv}>
            <Hidden xsDown>
              <Avatar src={avatar_url} className={classes.expandedAvatar} />
            </Hidden>
            <Typography variant="h4" className={classes.title}>
              {name}
            </Typography>
            <Divider />
            <List className={classes.flexDown}>
              <Button onClick={this.handleLogout} fullWidth={true} className={classes.logoutButton}>
                LOGOUT
              </Button>
              <Button onClick={this.handleReturnDashboard} fullWidth={true} className={classes.dashboardButton}>
                DASHBOARD
              </Button>
            </List>
          </div>
        </Drawer>
        <div className={classes.appBarSpacer} />
      </div>
    )
  }
}

/**
 * Function that maps variables from Redux Store to Home component's props.
 *
 * @param {Object} state - Redux Store
 * @memberof EntryEditor
 */
const mapStateToProps = state => ({
  loggedIn: state.login.loggedIn,
  name: state.login.name,
  id: state.login.id,
  avatar_url: state.login.avatar_url,
  gravatar_id: state.login.gravatar_id,
  error: state.login.error
})

/** 
 * Provides action creators to Home component's props.
 * 
 * @type {Object.<Function>} 
 * @memberof EntryEditor
 */
const mapDispatchToProps = {
  log_out_user,
  repopulate_state,
  clearCurrentWorkFromLocal
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(withRouter(Navbar)))
