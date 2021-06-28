import React, { Component } from 'react';
import { BeatLoader } from 'react-spinners';
import { log_out_user } from '../actions/LoginAction';
import { clearCurrentWorkFromLocal } from '../actions/PortfolioAction';
import axios from 'axios';
import { withStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router-dom';
import { handleErrors } from '../handlers/errorHandler';
import { connect } from 'react-redux';

/**
 * Style generator to dynamically adjust styles based on theme provided
 * 
 * @memberof LoginResult
 * @param {Object} theme 
 */
 const styles = (theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'start',
        alignItems: 'center'
    },
    appBarSpacer: theme.mixins.toolbar
});

class Logout extends Component {


    async componentDidMount() {
        await axios({
            method: 'GET',
            url: process.env.REACT_APP_BACKEND + '/logout',
            withCredentials: true
        }).then(res => {
            this.props.log_out_user();
            this.props.clearCurrentWorkFromLocal();
            localStorage.removeItem(process.env.REACT_APP_USER_LOCALSTORAGE);
            console.log("successfully cleared localStorage");
        }).then(() => {
            this.props.history.push("/");
        }).catch(err => {
            handleErrors(err, this.props.history);
        })
    }

    render() {
        const { classes } = this.props

        return (
            <div className={classes.root}>
                <div className={classes.appBarSpacer}/>
                <BeatLoader></BeatLoader>
            </div>
        )
        
    }
}

/**
 * Function that maps variables from Redux Store to Home component's props.
 *
 * @param {Object} state - Redux Store
 * @memberof Logout
 */
 const mapStateToProps = state => ({
  })
  

/** 
 * Provides action creators to Home component's props.
 * 
 * @type {Object.<Function>} 
 * @memberof Logout
 */
 const mapDispatchToProps = {
    log_out_user,
    clearCurrentWorkFromLocal
  }

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(withRouter(Logout)))
