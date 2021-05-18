import React, { Component } from 'react'
import { connect } from 'react-redux'
import { log_out_user } from '../actions/login.action'
import '../styles/navbar.css'
import axios from 'axios'


class Navbar extends Component {
    constructor() {
        super()
        this.handleLogout = this.handleLogout.bind(this)
    }
    
    handleLogout() {
        this.props.dispatch(log_out_user())
        axios('http://localhost:5000/logout', {
            method: 'GET',
            mode: 'cors',
            credentials: 'include',
        }).then(res => {
            console.log("successfully deleted cookie")
            console.log(res)
        })
        window.location.pathname = '/login'
    }
    

    render() {
        const { loggedIn, name, id, avatar_url, gravatar_url, error } = this.props
        
        if (error) {
            return <div>Error! {error.message}</div>
        }

        return (
            <div className = 'navbar-container'>
                <div className = 'navbar-title-container'>
                    <div className = 'navbar-title'>Portfol.io</div>
                </div>
                <div className = 'navbar-text-container'>
                    <div className = 'navbar-text'>Welcome {name}!</div>
                </div>
                <div className = 'navbar-button-container'>
                    {loggedIn 
                        ? <button onClick = {this.handleLogout} className = 'navbar-button'>
                            logout
                        </button>
                        : <span></span>
                    }
                </div>
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

export default connect(mapStateToProps)(Navbar)
