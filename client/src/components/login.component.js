import React, { Component } from 'react'
import { connect } from 'react-redux'
import { log_in_user, log_out_user } from '../actions/login.action'
import '../styles/login.css'
import axios from 'axios'

/**
 * NOTE: you can use log_in_user and log_out_user to set stuff in the initialState of login.reducer
 * Then navbar's button would supposedly change accordingly
 */
class Login extends Component {

    constructor() {
        super()
        this.state = {
            username: '',
            password: ''
        }
        this.handleUsernameChanged = this.handleUsernameChanged.bind(this)
        this.handlePasswordChanged = this.handlePasswordChanged.bind(this)
        this.handleLogin = this.handleLogin.bind(this)
    }

    handleUsernameChanged(event) {
        this.setState({
            username: event.target.value
        })
    }

    handlePasswordChanged(event) {
        this.setState({
            password: event.target.value
        })
    }

    handleLogin() {
        axios.post("BACKEND URL", {
            method: 'POST',
            mode: 'cors',
            headers: {

            },
            credentials: 'include',
            body: "{}"
        }).then(res => {
            console.log("YO")
        })
    }

    render() {
        const { loggedIn, user, error } = this.props
        return (
            <div className = 'form-container'>
                <form id = 'login'>
                    <label for = 'username'>Username:</label>
                    <input id = 'username' name = 'username' type = 'text' onChange = {this.handleUsernameChanged}></input>
                    <label for = 'password'>Password:</label>
                    <input id = 'password' name = 'password' type = 'password' onChange = {this.handlePasswordChanged}></input>
                    <button type = 'submit' onSubmit = {this.handleLogin}>Login</button>
                </form>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    loggedIn: state.login.loggedIn,
    user: state.login.user,
    error: state.login.error
})

export default connect(mapStateToProps)(Login)
