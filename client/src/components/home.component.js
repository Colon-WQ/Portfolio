import React, { Component } from 'react'
import { connect } from 'react-redux'
import '../styles/login.css'


class Home extends Component {
    render() {
        
        const { loggedIn, name, id, avatar_url, gravatar_url, error } = this.props
        return (
            <div className = 'login-container'>
                Here is your homepage {name}! You are loggedIn {loggedIn.toString()}
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