import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { repopulate_state } from '../actions/LoginAction';
import { fetchPortfolios, saveCurrentWorkToLocal, clearCurrentWorkFromLocal } from '../actions/PortfolioAction';
import { withStyles } from '@material-ui/core/styles';
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
     * Changes route to /edit to render a fresh Portfolio creation screen.
     * 
     * @return void
     * @memberof Dashboard
     */
    handleAddPortfolio = async () => {
        await this.props.clearCurrentWorkFromLocal();
        
        window.location.pathname = '/edit'
    }

    /**
     * Fetches the requested portfolio from mongoDB, then saves it to redux state.
     * Then changes route to /edit to render the Portfolio.
     * 
     * @return void
     * @param {*} event The DOM node that the click event was bound to. 
     */
    handleOpenPortfolio = async (event) => {
        const id = event.currentTarget.id;
        const portfolio = await axios({
            method: "GET",
            url: process.env.REACT_APP_BACKEND + "/portfolio/" + id,
            withCredentials: true
        }).then(res => {
            console.log(`portfolio ${res.data.portfolio.name} fetched`);
            return res.data.portfolio;
        }).catch(err => {
            if (err.response) {
                console.log(err.response.data);
            } else {
                console.log(err.message);
            }
        });

        console.log("portfolio pages");
        console.log(portfolio.pages[0].entries);
        //Need to wait for portfolio to be saved to localStorage before changing route
        //Since the website is public anyways, portfolio data is meant to be public and thus not considered sensitive.
        //LocalStorage is suitable to store portfolio data.
        await this.props.saveCurrentWorkToLocal(portfolio);

        window.location.pathname = '/edit'
    }

    render() {
        const { name, portfolios, classes } = this.props
        console.log(portfolios)
        return (
            <div className={classes.root}>
                <div className={classes.appBarSpacer}/>
                <Typography variant="h2" component="h3">Here is your dashboard {name}!</Typography>
                <Grid className={classes.gridHorizontal}>
                    {portfolios.map((element, idx) => {
                        return (<Button key={idx} id={element._id.valueOf()} onClick={this.handleOpenPortfolio} className={classes.portfolioButton}>
                            {element._id.valueOf()}
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
    fetchPortfolios,
    saveCurrentWorkToLocal,
    clearCurrentWorkFromLocal
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Dashboard));
