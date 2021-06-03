import React, {Component} from 'react';
import axios from 'axios';
import {connect} from 'react-redux';
import {repopulate_state} from '../actions/LoginAction';
import {fetchPortfolios} from '../actions/PortfolioAction';
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

/**
 * Style generator to dynamically adjust styles based on theme provided
 * 
 * @memberof Dashboard
 * @param {Object} theme 
 */
const styles = (theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'start',
        alignItems: 'center'
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
    },
    appBarSpacer: theme.mixins.toolbar
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
     * repopulateState takes a while to run, so it is necessary to await it, then fetchPortfolios again.
     * 
     * @return void
     * @memberof Dashboard
     */
    async componentDidMount() {
        if (!this.props.loggedIn) {
            const localStorageItem = JSON.parse(window.localStorage.getItem(process.env.REACT_APP_USER_LOCALSTORAGE));
            await this.props.repopulate_state(localStorageItem);
        }
        this.props.fetchPortfolios(this.props.id);
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

    /**
     * Testing purposes only. Changes route to /edit.
     * 
     * @return void
     * @memberof Dashboard
     */
     handleAddPortfolio() {
        window.location.pathname = '/edit'
    }

    render() {
        const {loggedIn, name, portfolios, classes } = this.props
        console.log(portfolios)
        return (
            <div className={classes.root}>
                <div className={classes.appBarSpacer}/>
                <Typography variant="h2" component="h3">Here is your dashboard {name}!</Typography>
                <Grid className={classes.gridHorizontal}>
                    {portfolios.map((element, idx) => {
                        return (<Button key={idx} className={classes.portfolioButton}>
                            {element.name}
                        </Button>);
                    })}
                    <Button onClick={this.handleAddPortfolio} className={classes.portfolioButton}>Add a Portfolio</Button>
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
    id: state.login.id,
    portfolios: state.portfolio.portfolios
});

/** 
 * Provides action creators to Home component's props.
 * 
 * @type {Object.<Function>} 
 * @memberof Dashboard
 */
const mapDispatchToProps = {
    repopulate_state,
    fetchPortfolios
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Dashboard));
