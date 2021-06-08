import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { repopulate_state } from '../actions/LoginAction';
import { fetchPortfolios, saveCurrentWorkToLocal, clearCurrentWorkFromLocal } from '../actions/PortfolioAction';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { withRouter } from 'react-router-dom';
import { BeatLoader } from 'react-spinners';


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

    constructor() {
        super();
        this.state = {
            nameDialogState: false,
            portfolioName: "MyPortfolio",
            duplicateKeyError: false,
            duplicateKeyHelperText: ""
        }

        this.handleAddPortfolio = this.handleAddPortfolio.bind(this);
        this.handleOpenPortfolio = this.handleOpenPortfolio.bind(this);
        this.handleOnChange = this.handleOnChange.bind(this);
        this.handleNameDialogClose = this.handleNameDialogClose.bind(this);
        this.handleNameDialogOpen = this.handleNameDialogOpen.bind(this);
    }

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
            const localStorageItem = await JSON.parse(window.localStorage.getItem(process.env.REACT_APP_USER_LOCALSTORAGE));
            await this.props.repopulate_state(localStorageItem);
        }
        await this.props.fetchPortfolios(this.props.id);
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

    handleOnChange(event) {
        this.setState({
            duplicateKeyError: false,
            duplicateKeyHelperText: ""
        })
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    handleNameDialogOpen() {
        this.setState({
            nameDialogState: true
        })
    }

    handleNameDialogClose() {
        this.setState({
            nameDialogState: false
        })
    }

    /**
     * Changes route to /edit to render a fresh Portfolio creation screen.
     * 
     * @return void
     * @memberof Dashboard
     */
    handleAddPortfolio() {

        if (this.props.portfolios.filter(portfolio => portfolio.name === this.state.portfolioName).length === 0) {
            //This clears current work from local, so we need to arrest the screen whenever user attempts to leave a portfolio
            //page and remind him to save before leaving.
            this.props.clearCurrentWorkFromLocal();

            const portfolio = {
                _id: undefined,
                name: this.state.portfolioName,
                pages: undefined
            }

            this.props.saveCurrentWorkToLocal(portfolio);
            this.props.history.push("/edit");
        } else {
            if (this.state.portfolioName === "") {
                this.setState({
                    duplicateKeyError: true,
                    duplicateKeyHelperText: "Portfolio name cannot be empty"
                })
            } else {
                this.setState({
                    duplicateKeyError: true,
                    duplicateKeyHelperText: "Portfolio name already exists"
                })
            }
        }
    }

    /**
     * Fetches the requested portfolio from mongoDB, then saves it to redux state.
     * Then changes route to /edit to render the Portfolio.
     * 
     * @return void
     * @param {*} event The DOM node that the click event was bound to. 
     */
    async handleOpenPortfolio(event) {
        const id = event.currentTarget.id;

        const portfolioLocalStorageItem = await JSON.parse(window.localStorage.getItem(process.env.REACT_APP_AUTOSAVE_LOCALSTORAGE));
        
        /** 
         * On returning to dashboard, the prompt will make sure that the user has already saved his work to mongoDB and to localStorage.
         * If the user wants to reopen the portfolio again, we can increase speed and reduce calls to backend by simply using the portfolio
         * that is already in the localStorage.
         */
        if (portfolioLocalStorageItem !== null) {
            if (portfolioLocalStorageItem._id === id) {
                console.log("portfolio already exists locally");
                this.props.history.push("/edit");
            }
        } else {
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

            //Need to wait for portfolio to be saved to localStorage before changing route
            //Since the website is public anyways, portfolio data is meant to be public and thus not considered sensitive.
            //LocalStorage is suitable to store portfolio data.
            await this.props.saveCurrentWorkToLocal(portfolio);

            this.props.history.push("/edit");
        }
        
    }

    render() {
        const { name, portfolios, classes } = this.props
        return (
            <div className={classes.root}>
                <div className={classes.appBarSpacer}/>
                <Typography variant="h2" component="h3">Here is your dashboard {name}!</Typography>
                <Grid className={classes.gridHorizontal}>
                    {
                        this.props.loading 
                        ?
                            <BeatLoader/>
                        :
                        this.props.error
                            ?
                                this.props.error.response.status === 404
                                ?
                                    <Typography variant="body1">Create your first Portfolio!</Typography>
                                :
                                    <Typography variant="body1">{this.props.error.message}</Typography>
                            :
                            portfolios.map((element, idx) => {
                                return (<Button key={idx} id={element._id.valueOf()} onClick={this.handleOpenPortfolio} className={classes.portfolioButton}>
                                    {element.name}
                                </Button>);
                            })
                    }
                </Grid>
                {/* <Button onClick={this.checkCookie} className={classes.portfolioButton}>Check Cookie</Button> */}
                <Button onClick={this.handleNameDialogOpen} className={classes.portfolioButton}>Add a Portfolio</Button>
                <Dialog
                    open={this.state.nameDialogState}
                    onClose={this.handleNameDialogClose}
                    aria-labelledby="portfolio name dialog"
                >
                    <DialogTitle id="portfolio-name-dialog-title">
                        Portfolio Name
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Set your Portfolio name here. This will be part of your website's url, so choose carefully.
                        </DialogContentText>
                        <TextField
                            name="portfolioName"
                            autoFocus
                            margin="dense"
                            label="Portfolio Name"
                            type="string"
                            defaultValue={this.state.portfolioName}
                            fullWidth
                            onChange={this.handleOnChange}
                            InputLabelProps={{
                                style: {color: "whitesmoke"},
                            }}
                            InputProps={{
                                color: 'secondary'
                            }}
                            error={this.state.duplicateKeyError}
                            helperText={this.state.duplicateKeyHelperText}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={this.handleNameDialogClose}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={this.handleAddPortfolio}
                        >
                            Set Name
                        </Button>
                    </DialogActions>
                </Dialog>
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
    portfolios: state.portfolio.portfolios,
    loading: state.portfolio.loading,
    error: state.portfolio.error
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

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(withRouter(Dashboard)));
