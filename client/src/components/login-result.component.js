import React, { Component } from 'react'
import axios from 'axios'

export default class LoginResult extends Component {
    constructor() {
        super()
        this.state = {
            ghCode: ''
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
            console.log("printing code:");
            console.log(ghCode);
            axios("http://localhost:5000/authenticate", {
                method: "POST",
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(bodyJSON)
            }).then(res => {
                console.log("POST response: ");
                console.log(res);
            });
        } else {
            console.log("code missing");
            console.log(window.location.search);
        }
    }

    render() {
        return (
            <div style = {{display: 'flex', flexDirection: 'row', paddingTop: '7%', justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%'}}>
                <h1>{this.state.ghCode}</h1>
            </div>
        )
    }
}
