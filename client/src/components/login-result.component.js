import React, { Component } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { log_in_user } from '../actions/login.action';
import '../styles/login.css';
import { BeatLoader } from 'react-spinners';

class LoginResult extends Component {
    

    componentDidMount() {
        let search = window.location.search;
        let params = new URLSearchParams(search);
        let ghCode = params.get('code');
        const bodyJSON = { code: ghCode };

        if (ghCode !== "") {
            //TODO: remove this vvv
            // console.log("printing code:");
            // console.log(ghCode);
            axios({
                method: "POST",
                url: `${process.env.REACT_APP_BACKEND}/login/authenticate`,
                withCredentials: true,
                responseType: 'json',
                data: {
                    code: ghCode
                }
            }).then(res => {
                console.log("POST response: ");
                console.log(res);
                this.props.log_in_user(res.data)
            }).catch(err => {
                console.log(err.message);
            })
        } else {
            console.log("gh code missing");
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
    log_in_user
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginResult)