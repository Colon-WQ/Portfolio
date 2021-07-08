import React, { Component } from 'react';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { log_in_user } from '../actions/LoginAction';
import { fetchPortfolios } from '../actions/PortfolioAction';
import { withStyles } from '@material-ui/core/styles';
import { BeatLoader } from 'react-spinners';
import { handleErrors } from '../handlers/errorHandler';
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

    constructor() {
        super();
        this.handleLogin = this.handleLogin.bind(this);
      }
    
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
    async componentDidMount() {

        //If user is not loggedIn already
        if (!this.props.loggedIn) {
            //Check if loggedIn user might have accidentally refreshed into this url
            const localStorageItem = await JSON.parse(window.localStorage.getItem(process.env.REACT_APP_USER_LOCALSTORAGE))
            //If localStorage returns null, user is not loggedIn, proceed to login
            if (localStorageItem === null) {
                await this.handleLogin();
            } else { 
                //If localStorage does return an item, then user can either be loggedIn or not loggedIn
                if (localStorageItem.loggedIn) {
                    this.props.history.push('/dashboard');
                } else {
                    await this.handleLogin();
                }
            }
        }
        
    }

    async handleLogin() {
        let search = window.location.search;
        let params = new URLSearchParams(search);
        let ghCode = params.get('code');

        if (ghCode !== null) {
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
                
                this.props.fetchPortfolios(data.id)
                this.props.log_in_user(data)
            }).then(() => {
                this.props.history.push("/dashboard");
            }).catch(err => {
                handleErrors(err, this.props.history);
            })
        } else {
            //At this point, there's no localStorage user data, and user does not want to authorize.
            //Can only proceed as Guest.
            console.log("gh code not found, proceeding as Guest");
            this.props.history.push('/dashboard');
        }
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
    fetchPortfolios
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(withRouter(LoginResult)))