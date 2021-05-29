import React, { Component } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { log_in_user, repopulate_state } from '../actions/LoginAction';
import { fetchPortfolios } from '../actions/PortfolioAction';
import { withStyles } from '@material-ui/core/styles';
import { BeatLoader } from 'react-spinners';
/**
 * @file LoginResult component serves as the endpoint of Github authorization request and also
 * provides visual loading display when Github authorization is in progress.
 * 
 * @author Chen En
 * @author Chuan Hao
 * 
 * @see LoginResult
 */

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

/**
 * Component that displays loading animation while Github authentication occurs.
 * 
 * @author Chen En
 * @author Chuan Hao
 * 
 * @component
 */
class LoginResult extends Component {
    
    /**
     * If user is logged in already, the user will be redirected to Dashboard. 
     * 
     * Otherwise, an attempt will be made to fetch user details and logged in status from localStorage after component is rendered.
     * 
     * If user's logged in status is Undefined, an attempt will be made to authenticate the user. Otherwise, he will
     * also be redirected to Dashboard.
     *
     * @return void
     * @memberof LoginResult
     */
    componentDidMount() {

        //If user is not loggedIn already
        if (!this.props.loggedIn) {
            //Check if loggedIn user might have accidentally refreshed into this url
            const localStorageItem = JSON.parse(window.localStorage.getItem(process.env.REACT_APP_USER_LOCALSTORAGE))
            //If localStorage returns null, user is not loggedIn, proceed to login
            if (localStorageItem == null) {
                let search = window.location.search;
                let params = new URLSearchParams(search);
                let ghCode = params.get('code');

                if (ghCode !== "") {
                    axios({
                        method: "POST",
                        url: `${process.env.REACT_APP_BACKEND}/login/authenticate`,
                        withCredentials: true,
                        responseType: 'json',
                        data: {
                            code: ghCode
                        }
                    }).then(res => res.data)
                    .then(data => {
                        /** For setting to localStorage, chose not to just dump entire redux state here because
                         * we may want to only save certain data to localStorage
                         */
                        const forLocalStorage = {
                            loggedIn: true,
                            name: data.name,
                            id: data.id,
                            avatar_url: data.avatar_url,
                            gravatar_id: data.gravatar_id
                        }
                        window.localStorage.setItem(process.env.REACT_APP_USER_LOCALSTORAGE, JSON.stringify(forLocalStorage))
                        /**TODO: Implement IDEA => need to create a route that fetches user's portfolios' names and images only. We store this
                         * in localStorage just like we did user peripherals.
                         * In the dashboard, only when we click on the portfolio to be worked on. Then we fetch the actual portfolios themselves,
                         * In the template editor, when the user is working on the portfolio, we will save his current work to localStorage in intervals
                         * 
                         * When user leaves the template editor, we save his current work to the mongodb database,
                         * then wipe the localStorage of the current portfolio's work.
                         */
                        this.props.fetchPortfolios(data.id)
                        this.props.log_in_user(data)
                    }).catch(err => {
                        console.log(err.message);
                    })
                } else {
                    console.log("gh code missing");
                }
            } else { //If localStorage does return an item, then user is already logged in
                this.props.repopulate_state(localStorageItem)
            }
        }
        
    }

    render() {
        const { loggedIn, classes } = this.props
        if (loggedIn) {
            return (
                <Redirect to = '/dashboard'></Redirect>
            )
        } else {
            return (
                <div className={classes.root}>
                    <div className={classes.appBarSpacer}/>
                    <BeatLoader></BeatLoader>
                </div>
            )
        }
        
    }
}

/**
 * Function that maps variables from Redux Store to Home component's props.
 *
 * @param {Object} state - Redux Store
 * @memberof LoginResult
 */
const mapStateToProps = state => ({
    loggedIn: state.login.loggedIn
})

/** 
 * Provides action creators to Home component's props.
 * 
 * @type {Object.<Function>} 
 * @memberof LoginResult
 */
const mapDispatchToProps = {
    log_in_user,
    repopulate_state,
    fetchPortfolios
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(LoginResult))