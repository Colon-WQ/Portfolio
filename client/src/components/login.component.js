import React, { Component } from 'react'
import { connect } from 'react-redux'
import '../styles/login.css'

class Login extends Component {

    render() {
        const { loggedIn } = this.props
        return (
            <div className = 'login-container'>
                <a href={`https://github.com/login/oauth/authorize?scope=repo&client_id=` + process.env.REACT_APP_CLIENT_ID} className = 'button'>Login with github</a>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    loggedIn: state.login.loggedIn
})

export default connect(mapStateToProps)(Login)
