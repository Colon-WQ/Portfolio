import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { repopulate_state } from '../actions/login.action'
import '../styles/login.css';
import Typography from '@material-ui/core/Typography';
import CssBaseline from '@material-ui/core/CssBaseline';
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import { Avatar, Button, Divider, Drawer, Hidden, IconButton, List, ListItem } from '@material-ui/core';

/**
 * styles function defines css elements to be overwritten to a given MUI theme.
 *
 * @param {Object} theme - an MUI theme.
 * @return {Object} - an MUI theme with selected css elements overwritten.
 * @memberof Home
 */
const styles = (theme) => ({
    root: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
    },
    centeredDiv: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
    },
    welcomeDiv: {
        width: '100%',
        height: '100vh',
        backgroundImage: `url("${"https://compote.slate.com/images/926e5009-c10a-48fe-b90e-fa0760f82fcd.png?width=1200&rect=680x453&offset=0x30"}")`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
    },
    welcomeText: {
        flexGrow: 1,

    },
    multiline: {
        whiteSpace: 'pre-line',
    },
    portfolioIcon: {
        width: '40vh',
        height: '40vh',
        borderRadius: '20vh',
    },
    featuresDiv: {
        position: 'relative',
        width: '100%',
        height: '60vh',
        flexDirection: 'row',
    },
    featureTextDiv: {
        position: 'absolute',
        top: 0,
        right : 0,
        width: '55vw',
        height: '100%',
        padding: '10%',
    },
    featureImgDiv: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '45vw',
        height: '100%'
    },
    fullSize: {
        width: '100%',
        height: '100%',
    },
    floating: {
        zIndex: 1,
    },
    featureButtonLeft: {
        height: '100%',
        position: 'absolute',
        left: 0,
    },
    featureButtonRight: {
        height: '100%',
        position: 'absolute',
        right: 0,
    }
});

/** 
 * Integer representing size of feature arrays.
 * 
 * @type {number} 
 * @memberof Home
 */
const featureMaxIndex = 2;

/** 
 * Array of strings representing feature images.
 * 
 * @type {Array.<string>} 
 * @memberof Home
 */
const featureImage = [
    'https://afkgaming.com/media/images/55143-08bf98e6a4535406acafc015adf99434.jpeg', 
    'https://www.streamscheme.com/wp-content/uploads/2020/09/ForsenCD-emote.jpg', 
    'https://i.redd.it/93eeyq563wo11.png'
];

/** 
 * Array of strings representing feature titles.
 * 
 * @type {Array.<string>} 
 * @memberof Home
 */
const featureTitle = [
    'Your Design. Your Website.',
    'temporary text',
    'third wheel'
];

/** 
 * Array of strings representing feature texts.
 * 
 * @type {Array.<string>} 
 * @memberof Home
 */
const featureText=[
    'No watermarks, no restrictions — you own your website',
    'subtext2',
    'subtext3'
];

/** 
 * @type {Array.<string>} 
 * @memberof Home
 */
const faqQuestions=['is free?', 'can I has access token?', 'how to generate css'];

/** 
 * @type {Array.<string>} 
 * @memberof Home
 */
const faqAnswers=['yes\nof\ncourse', 'no', 'idk' ];

/**
 * Component that shows the homepage of Portfol.io.
 * 
 * @author Chen En
 * @author Chuan Hao
 * 
 * @component
 * @category Home
 */
class Home extends Component {

    /**
     * @constructor
     */
    constructor() {
        super();
        this.handleFeatureClick = this.handleFeatureClick.bind(this);
        this.handleFeatureNext = this.handleFeatureNext.bind(this);
        this.handleFeaturePrev = this.handleFeaturePrev.bind(this);

        /**
         * @typedef {Object} state
         * @property {number} featureIndex - index of feature elements to be rendered.
         * @property {number} featureTitle - string representing feature title.
         * @property {string} featureText - string representing feature text.
         * @property {string} featureImage - string representing url of feature image to be rendered.
         * @memberof Home
         */
        this.state = {
            featureIndex: 0,
            featureText: featureText[0],
            featureTitle: featureTitle[0],
            featureImage: featureImage[0]
        }
    }

    /**
     * Attempts to fetch user details and logged in status from localStorage after component is rendered.
     * 
     * @property {Function} componentDidMount
     * @returns void
     * @memberof Home
     */
    componentDidMount() {
        if (!this.props.loggedIn) {
            const localStorageItem = JSON.parse(window.localStorage.getItem(process.env.REACT_APP_USER_LOCALSTORAGE))
            this.props.repopulate_state(localStorageItem)
        }
    }

    /**
     * Changes feature title, text and image in state to be rendered on button click.
     * 
     * @property {Function} handleFeatureClick
     * @param {number} newIndex -Index of array elements to be rendered.
     * @returns void
     * @memberof Home
     */
    handleFeatureClick(newIndex) {
        this.setState({
            featureIndex: newIndex,
            featureTitle: featureTitle[newIndex],
            featureText: featureText[newIndex],
            featureImage: featureImage[newIndex]
        })
    }

    /**
     * Increments featureIndex by 1 or wraps around to 0 if featureIndex is equals to featureMaxIndex before increment.
     * 
     * @property {Function} handleFeatureNext
     * @returns void
     * @memberof Home
     */
    handleFeatureNext() {
        const newIndex = this.state.featureIndex === featureMaxIndex ? 0 : this.state.featureIndex + 1;
        this.handleFeatureClick(newIndex);
    }

    /**
     * Decrements featureIndex by 1 or wraps around to featureMaxIndex if featureIndex is equals to 0 before decrement.
     * 
     * @property {Function} handleFeaturePrev
     * @memberof Home
     */
    handleFeaturePrev() {
        const newIndex = this.state.featureIndex === 0 ? featureMaxIndex : this.state.featureIndex - 1;
        this.handleFeatureClick(newIndex);
    }

    render() {
        const { loggedIn, classes } = this.props;
        return (
            <div className = {classes.root}>
                <CssBaseline/>
                <div className={`${classes.welcomeDiv} ${classes.centeredDiv}`}>
                    <img src={'https://blog.cdn.own3d.tv/resize=fit:crop,height:400,width:600/tbv2RYWpReqNtof2dD0U'} 
                    className={classes.portfolioIcon} alt={'Portfol.io icon'}></img>
                    <Typography component="h1" variant="h2" color="inherit" noWrap className={classes.title}>
                        SAMPLE TEXT
                    </Typography>
                    {/* must use \n to make multiline */}
                    <Typography component="h1" variant="h6" color="inherit" className={classes.multiline}>
                        {"KAPPA OUTDATED\nPOGCHAMP OVERRATED\nLONG HAVE WE WAITED\nNOW WE JEBAITED"}
                    </Typography>
                    {loggedIn 
                        ?
                        <Link to = '/dashboard'>You're logged in already! Lets go to dashboard</Link>
                        :
                        <Button 
                            href={`https://github.com/login/oauth/authorize?scope=repo&client_id=` + process.env.REACT_APP_CLIENT_ID} 
                            color="primary" 
                            variant="contained"
                        >
                            Login with Github
                        </Button>
                    }
                    
                </div>
                <div className={`${classes.featuresDiv} ${classes.centeredDiv}`}>
                    <Button onClick={this.handleFeaturePrev} className={`${classes.floating} ${classes.featureButtonLeft}`}>
                        <FaChevronLeft/>
                    </Button>
                    <div className={classes.featureImgDiv}>
                        <img src={this.state.featureImage} className={classes.fullSize} alt={`feature ${this.state.featureSection}`}></img>
                    </div>
                    <div className={`${classes.featureTextDiv} ${classes.centeredDiv}`}>
                        <Typography component="h2" variant="h2" color="inherit" noWrap className={classes.title}>
                            {this.state.featureTitle}
                        </Typography>
                        <Typography component="h6" variant="h6" color="inherit" noWrap className={classes.title}>
                            {this.state.featureText}
                        </Typography>
                    </div>
                    <Button onClick={this.handleFeatureNext} className={`${classes.floating} ${classes.featureButtonRight}`}>
                        <FaChevronRight/>
                    </Button>
                </div>
                <div className={`${classes.faqDiv} ${classes.centeredDiv}`}>
                    <List>
                        <ListItem>
                            {/*  */}
                        </ListItem>
                    </List>
                </div>
            </div>
        )
    }
}

/**
 * Function that maps variables from Redux Store to Home component's props.
 *
 * @param {Object} state - Redux Store
 * @memberof Home
 */
const mapStateToProps = state => ({
    loggedIn: state.login.loggedIn,
    name: state.login.name,
    id: state.login.id,
    avatar_url: state.login.avatar_url,
    gravatar_id: state.login.gravatar_id,
    error: state.login.error
})

/** 
 * Provides action creators to Home component's props.
 * 
 * @type {Object.<Function>} 
 * @memberof Home
 */
const mapDispatchToProps = {
    repopulate_state
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Home));
