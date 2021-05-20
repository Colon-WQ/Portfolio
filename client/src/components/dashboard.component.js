import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { repopulate_state } from '../actions/login.action'
import '../styles/login.css';


class Dashboard extends Component {

    componentDidMount() {
        if (!this.props.loggedIn) {
            const localStorageItem = JSON.parse(window.localStorage.getItem('portfolioUser'))
            this.props.repopulate_state(localStorageItem)
        }
    }

    // Testing purposes
    checkCookie(e) {
        console.log('testing cookie')
        axios({
            method: "GET",
            url: process.env.REACT_APP_BACKEND + '/portfolio/status',
            withCredentials: true
        }).then(res => {
            console.log("authorized")
            console.log(res.data)
        });
    }

    render() {
        const { loggedIn, name } = this.props
        return (
            <div className = 'login-container'>
                <p>Here is your homepage {name}! You are loggedIn</p>
                <button onClick={this.checkCookie}>check cookie</button>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    loggedIn: state.login.loggedIn,
    name: state.login.name
});

const mapDispatchToProps = {
    repopulate_state
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
