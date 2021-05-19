import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import '../styles/login.css';


class Dashboard extends Component {

    // Testing purposes
    checkCookie(e) {
        console.log(process.env.REACT_APP_BACKEND);
        axios({
            method: "GET",
            url: process.env.REACT_APP_BACKEND + '/portfolio/status',
            withCredentials: true}).then(res => console.log(res.body.created));
    }

    render() {
        const { loggedIn, name, id, avatar_url, gravatar_url, error } = this.props
        return (
            <div className = 'login-container'>
                <p>Here is your homepage {name}! You are loggedIn {loggedIn.toString()}</p>
                <button onClick={this.checkCookie}>check cookie</button>
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
});

export default connect(mapStateToProps)(Dashboard);
