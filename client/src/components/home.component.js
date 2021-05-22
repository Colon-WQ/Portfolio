import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { repopulate_state } from '../actions/login.action'
import '../styles/login.css';
import Typography from '@material-ui/core/Typography';
import CssBaseline from '@material-ui/core/CssBaseline';

import { withStyles } from '@material-ui/core/styles';
import { Avatar, Button, Divider, Drawer, Hidden, IconButton } from '@material-ui/core';

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
    aboutDiv: {
        width: '100%',
        height: '60vh',
        flexDirection: 'row',
    },
    aboutTextDiv: {
        width: '55vw',
        height: '100%',
        padding: '10%',
    },
    aboutImgDiv: {
        width: '45vw',
        height: '100%'
    },
    fullSize: {
        width: '100%',
        height: '100%',
    }
})

const aboutMaxIndex = 2;
const aboutImage = [
    'https://afkgaming.com/media/images/55143-08bf98e6a4535406acafc015adf99434.jpeg', 
    'img2', 
    'img3'];
const aboutTitle = [
    'Your Design. Your Website.',
    'temporary text',
    'third wheel'
]
const aboutText=[
    'No watermarks, no restrictions — you own your website',
    'subtext2',
    'subtext3'
]

class Home extends Component {
    
    constructor() {
        super();
        this.state = {
            aboutIndex: 0,
            aboutText: aboutText[0],
            aboutTitle: aboutTitle[0],
            aboutImage: aboutImage[0]
        }
    }

    componentDidMount() {
        if (!this.props.loggedIn) {
            const localStorageItem = JSON.parse(window.localStorage.getItem(process.env.REACT_APP_USER_LOCALSTORAGE))
            this.props.repopulate_state(localStorageItem)
        }
    }
    

    handleLogin() {
        window.location.pathname = '/login';
    }

    handleAboutNext() {
        //
    }

    handleAboutPrev() {
        //
    }

    render() {
        const { classes } = this.props;
        console.log(this.state.aboutImage);
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
                    <Button onClick={this.handleLogin} color="primary" variant="contained">
                        Login
                    </Button>
                </div>
                <div className={`${classes.aboutDiv} ${classes.centeredDiv}`}>
                    <div className={classes.aboutImgDiv}>
                        <img src={this.state.aboutImage} className={classes.fullSize} alt={`about ${this.state.aboutSection}`}></img>
                    </div>
                    <div className={`${classes.aboutTextDiv} ${classes.centeredDiv}`}>
                        <Typography component="h2" variant="h2" color="inherit" noWrap className={classes.title}>
                            {this.state.aboutTitle}
                        </Typography>
                        <Typography component="h6" variant="h6" color="inherit" noWrap className={classes.title}>
                            {this.state.aboutText}
                        </Typography>
                    </div>
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
    gravatar_id: state.login.gravatar_id,
    error: state.login.error
})

const mapDispatchToProps = {
    repopulate_state
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Home));
