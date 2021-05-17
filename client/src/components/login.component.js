import React, { Component } from 'react'
import { connect } from 'react-redux'
import { log_in_user, log_out_user } from '../actions/login.action'
import '../styles/login.css'
import axios from 'axios'

class Login extends Component {

    render() {
        const { loggedIn } = this.props
        return (
            <div className = 'login-container'>
                <a href={`https://github.com/login/oauth/authorize?scope=repo&client_id=` + process.env.REACT_APP_CLIENT_ID} class = 'button'>Login with github</a>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    loggedIn: state.login.loggedIn
})

export default connect(mapStateToProps)(Login)
