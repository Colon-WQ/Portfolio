import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { repopulate_state } from '../actions/login.action'
import '../styles/login.css';
import AppBar from '@material-ui/core/AppBar'
import { Button } from '@material-ui/core';



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
        return (
            <div className = 'login-container'>
                <Button onClick={this.handleLogin}>
                    Login
                </Button>
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

export default connect(mapStateToProps, mapDispatchToProps)(Home)