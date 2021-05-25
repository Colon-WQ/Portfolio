import React, {Component} from 'react';
import axios from 'axios';
import {connect} from 'react-redux';
import {repopulate_state} from '../actions/LoginAction';
import '../styles/login.css';
import {withStyles} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';


/**
 * @file Dashboard component displays previews of the user's portfolios and offers 
 * functionalities that allow creation of new user portfolios.
 * 
 * @author Chen En
 * @author Chuan Hao
 * 
 * @see Dashboard
 */
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
});

/**
 * The dashboard logged in users will use to navigate the page
 * 
 * @component
 */
class Dashboard extends Component {
    /**
     * Attempts to fetch user details and logged in status from localStorage after component is rendered.
     * 
     * @property {Function} componentDidMount
     * @return void
     * @memberof Dashboard
     */
    componentDidMount() {
        if (!this.props.loggedIn) {
            const localStorageItem = JSON.parse(window.localStorage.getItem(process.env.REACT_APP_USER_LOCALSTORAGE));
            this.props.repopulate_state(localStorageItem);
        }
    }

    /**
     * Testing purposes only
     * 
     * @param {*} e unused
     * @ignore
     */
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

    openTemplateEditor() {
        window.location.pathname = '/templateEditor'
    }

    render() {
        const {loggedIn, name, portfolios, classes } = this.props
        return (
            <div className={classes.root}>
                <Typography variant="h2" component="h3">Here is your dashboard {name}!</Typography>
                <Grid className={classes.gridHorizontal}>
                    {portfolios.map((element, idx) => {
                        return (<Button key={idx} className={classes.portfolioButton}>
                            {element.title}
                        </Button>);
                    })}
                    <Button onClick={this.openTemplateEditor} className={classes.portfolioButton}>Add a Portfolio</Button>
                </Grid>
                <Button onClick={this.checkCookie} className={classes.portfolioButton}>Check Cookie</Button>
            </div>

        )
    }
}

/**
 * Function that maps variables from Redux Store to Home component's props.
 *
 * @param {Object} state - Redux Store
 * @memberof Dashboard
 */
const mapStateToProps = state => ({
    loggedIn: state.login.loggedIn,
    name: state.login.name,
    portfolios: state.portfolios.portfolios
});

/** 
 * Provides action creators to Home component's props.
 * 
 * @type {Object.<Function>} 
 * @memberof Dashboard
 */
const mapDispatchToProps = {
    repopulate_state
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Dashboard));
