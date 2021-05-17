import React, { Component } from 'react'
import { connect } from 'react-redux'
import '../styles/navbar.css'


class Navbar extends Component {

    render() {
        const { loggedIn, user, error } = this.props

        if (error) {
            return <div>Error! {error.message}</div>
        }

        return (
            <div className = 'navbar-container'>
                <div className = 'navbar-title-container'>
                    <div className = 'navbar-title'>Portfol.io</div>
                </div>
                <div className = 'navbar-text-container'>
                    <div className = 'navbar-text'>Welcome {user}!</div>
                </div>
                <div className = 'navbar-button-container'>
                    <button className = 'navbar-button'>
                        {loggedIn ? 'login' : 'logout'}
                    </button>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    loggedIn: state.login.loggedIn,
    user: state.login.user,
    error: state.login.error
})

export default connect(mapStateToProps)(Navbar)
