import React, { Component } from 'react';
import { connect } from 'react-redux';
import { log_out_user } from '../actions/login.action';
import '../styles/navbar.css';
import axios from 'axios';
import AppBar from '@material-ui/core/AppBar';
import ToolBar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { FaBars } from 'react-icons/fa';
import useScrollTrigger from '@material-ui/core/useScrollTrigger';
import Slide from '@material-ui/core/Slide';
import CssBaseline from '@material-ui/core/CssBaseline';

import { withStyles } from '@material-ui/core/styles';
import { Avatar, Button, Drawer, IconButton } from '@material-ui/core';

const drawerWidth=300;

const styles = (theme) => ({
    root: {
      display: 'flex',
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
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    appBarShift: {
      marginRight: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    menuButton: {
    //   marginLeft: 0,
      marginRight: 36,
    },
    menuButtonHidden: {
      display: 'none',
    },
    title: {
      flexGrow: 1,
    },
    drawerDiv: {
        display: 'block',
        justifyContent: 'center',
        margin: 'auto',
        textAlign: 'center',
    },
    drawerPaper: {
    //   position: 'relative',
      whiteSpace: 'nowrap',
      width: drawerWidth,
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
        height: theme.spacing(30),
        width: theme.spacing(30)
    }
  });



class Navbar extends Component {
    
    constructor() {
        super();
        this.handleLogout = this.handleLogout.bind(this);
        this.handleUserMenu = this.handleUserMenu.bind(this);
        this.state = {
            menu_open: false,
            user_drawer_open: false
        }
    }
    
    handleLogout() {
        console.log("logging out")
        this.props.dispatch(log_out_user())
        axios({
            method: 'GET',
            url: process.env.REACT_APP_BACKEND + '/logout',
            withCredentials: true
        }).then(res => {
            window.location.pathname = '/'
        })
    }

    handleUserMenu() {
        console.log(this.state.user_drawer_open);
        this.setState({user_drawer_open: !this.state.user_drawer_open});
    }

    render() {
        const { loggedIn, name, id, avatar_url, gravatar_url, error } = this.props
        
        if (error) {
            return <div>Error! {error.message}</div>
        }
        
        const { classes } = this.props;

        // CssBaseline gets the default body style and applies it (background colour etc.)
        return (
            <div className = {classes.root}>
                <CssBaseline />
                <AppBar position="absolute" 
                className={this.state.user_drawer_open 
                    ? `${classes.appBar} ${classes.appBarShift}` 
                    : classes.appBar}>
                    <ToolBar classname={classes.toolbar}>
                        <IconButton>
                            {/* logo here */}
                        </IconButton>
                        <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
                            Portfol.io
                        </Typography>
                        <Button startIcon={<Avatar src={avatar_url}/>} 
                        onClick={this.handleUserMenu} 
                        hidden={loggedIn}
                        className={loggedIn && !this.state.user_drawer_open ? "" : classes.hide }>
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
                    <div className={classes.toolbarIcon}>
                        <div className={classes.drawerDiv}>
                            <Avatar src={avatar_url} className={classes.expandedAvatar}/>
                            <Typography>
                                {name}
                            </Typography>
                        </div>
                    </div>
                </Drawer>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    loggedIn: state.login.loggedIn,
    name: state.login.name,
    id: state.login.id,
    avatar_url: state.login.avatar_url,
    gravatar_url: state.login.gravatar_url,
    error: state.login.error
})

export default connect(mapStateToProps)(withStyles(styles)(Navbar))
