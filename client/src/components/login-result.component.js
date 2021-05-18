import React, { Component } from 'react'
import axios from 'axios'
import { Redirect } from 'react-router-dom'
import { log_in_user } from '../actions/login.action'
import '../styles/login.css'
import { BeatLoader } from 'react-spinners'

export default class LoginResult extends Component {
    constructor() {
        super()
        this.state = {
            ghCode: '',
            isToken: false
        }
    }

    componentDidMount() {
        let search = window.location.search;
        let params = new URLSearchParams(search);
        let ghCode = params.get('code');
        this.setState({
            ghCode: ghCode
        })
        const bodyJSON = { code: ghCode };

        if (ghCode !== "") {
            //TODO: remove this vvv
            // console.log("printing code:");
            // console.log(ghCode);
            // axios.post(process.env.REACT_APP_BACKEND + "login/authenticate", {
            //     code: ghCode
            // }).then(res => {
            //     console.log("POST response: ")
            //     console.log(res)
            //     this.props.dispatch(log_in_user(res))
            // })

            axios({
                method: "POST",
                url: process.env.REACT_APP_BACKEND + "login/authenticate",
                withCredentials: true,
                responseType: 'json',
                data: {
                    code: ghCode
                }
            }).then(res => {
                console.log("POST response: ");
                console.log(res);
                this.props.dispatch(log_in_user(res))
            })
        } else {
            console.log("gh code missing");
        }
    }

    render() {
        if (this.state.isToken) {
            return (
                <Redirect to = '/home'></Redirect>
            )
        } else {
            return (
                <div className = 'login-container'>
                    <BeatLoader></BeatLoader>
                </div>
            )
        }
        
    }
}
