import React, { Component } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { log_in_user } from '../actions/login.action';
import '../styles/login.css';
import { BeatLoader } from 'react-spinners';

class LoginResult extends Component {
    

    componentDidMount() {
        /**If user is loggedIn already, <Redirect> below would already redirect the user to dashboard.
         * Otherwise, we try to login the user, either by getting info from localStorage if user was loggedIn,
         * or we make a request to authenticate a new user.
         */

        //If user is not loggedIn already
        if (!this.props.loggedIn) {
            //Check if loggedIn user might have accidentally refreshed into this url
            const localStorageItem = JSON.parse(window.localStorage.getItem('portfolioUser'))
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
                        window.localStorage.setItem("portfolioUser", JSON.stringify(forLocalStorage))
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
        const { loggedIn } = this.props
        if (loggedIn) {
            return (
                <Redirect to = '/dashboard'></Redirect>
            )
        } else {
            return (
                <div className = 'login-container'>
                    <BeatLoader></BeatLoader>
                </div>
            )
        }
        
    }
}

const mapStateToProps = state => ({
    loggedIn: state.login.loggedIn
})

const mapDispatchToProps = {
    log_in_user,
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginResult)