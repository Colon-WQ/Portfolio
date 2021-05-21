import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { repopulate_state } from '../actions/login.action'
import '../styles/login.css';
import { withStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'

const styles = (theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'start',
        alignItems: 'center',
        paddingTop: '7%'
    },
    gridHorizontal: {
        container: true,
        direction: 'row',
        justify: 'space-evenly',
        alignItems: 'center',
    },
    portfolioButton: {
        margin: theme.spacing(1),
        variant: 'contained',
        size: 'large',
        color: 'primary'
    }
})

class Dashboard extends Component {

    componentDidMount() {
        if (!this.props.loggedIn) {
            const localStorageItem = JSON.parse(window.localStorage.getItem(process.env.REACT_APP_USER_LOCALSTORAGE))
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
        const { loggedIn, name, portfolios, classes} = this.props
        return (
            <div className = {classes.root}>
                <Typography variant = "h2" component = "h3">Here is your dashboard {name}!</Typography>
                <Grid className = {classes.gridHorizontal}>
                    {portfolios.map((element, idx) => {
                        <Button key = {idx} className = {classes.portfolioButton}>
                            {element.title}
                        </Button>
                    })}
                    <Button className = {classes.portfolioButton}>Add a Portfolio</Button>
                </Grid>
                <Button onClick = {this.checkCookie} className = {classes.portfolioButton}>Check Cookie</Button>
            </div>
            
        )
    }
}

const mapStateToProps = state => ({
    loggedIn: state.login.loggedIn,
    name: state.login.name,
    portfolios: state.portfolios.portfolios
});

const mapDispatchToProps = {
    repopulate_state
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Dashboard));
