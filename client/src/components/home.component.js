import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { repopulate_state } from '../actions/login.action'
import '../styles/login.css';
import Typography from '@material-ui/core/Typography';
import CssBaseline from '@material-ui/core/CssBaseline';

import { withStyles } from '@material-ui/core/styles';
import { Avatar, Button, Divider, Drawer, Hidden, IconButton } from '@material-ui/core';

const styles = (theme) => ({
    root: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      },
    
    welcomeDiv: {
        width: '100%',
        height: '80vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundImage: `url("${"https://compote.slate.com/images/926e5009-c10a-48fe-b90e-fa0760f82fcd.png?width=1200&rect=680x453&offset=0x30"}")`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
    }
})

class Home extends Component {

    componentDidMount() {
        if (!this.props.loggedIn) {
            const localStorageItem = JSON.parse(window.localStorage.getItem('portfolioUser'))
            this.props.repopulate_state(localStorageItem)
        }
    }

    handleLogin() {
        window.location.pathname = '/login';
    }

    render() {
        const { classes } = this.props;

        return (
            <div className = {classes.root}>
                <CssBaseline/>
                <div className={classes.welcomeDiv}>
                    <Button onClick={this.handleLogin}>
                        Login
                    </Button>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    loggedIn: state.login.loggedIn,
    name: state.login.name,
    id: state.login.id,
    avatar_url: state.login.avatar_url,
    gravatar_id: state.login.gravatar_id,
    error: state.login.error
})

const mapDispatchToProps = {
    repopulate_state
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Home));
