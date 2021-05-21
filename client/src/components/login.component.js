import React, { Component } from 'react';
import { connect } from 'react-redux';
import { repopulate_state } from '../actions/login.action'
import { Link } from 'react-router-dom'
import '../styles/login.css';

class Login extends Component {

    componentDidMount() {
        if (!this.props.loggedIn) {
          const localStorageItem = JSON.parse(window.localStorage.getItem(process.env.REACT_APP_USER_LOCALSTORAGE))
          this.props.repopulate_state(localStorageItem)
        }
      }

    render() {
        const { loggedIn } = this.props
        if (loggedIn) {
            return (
                <div className = 'login-container'>
                    <Link to = '/dashboard'>You're logged in already! Lets go to dashboard</Link>
                </div>
            )
        } else {
            return (
                <div className = 'login-container'>
                    <a href={`https://github.com/login/oauth/authorize?scope=repo&client_id=` + process.env.REACT_APP_CLIENT_ID} className = 'button'>Login with github</a>
                </div>
            )
        }
        
    }
}

const mapStateToProps = state => ({
    loggedIn: state.login.loggedIn
})

const mapDispatchToProps = {
    repopulate_state
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)
