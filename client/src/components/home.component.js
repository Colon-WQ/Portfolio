import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import '../styles/login.css';
import AppBar from '@material-ui/core/AppBar'

class Home extends Component {
    render() {
        return (
            <div className = 'login-container'>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    loggedIn: state.login.loggedIn,
    name: state.login.name,
    id: state.login.id,
    avatar_url: state.login.avatar_url,
    gravatar_url: state.login.gravatar_url,
    error: state.login.error
})

export default connect(mapStateToProps)(Home)