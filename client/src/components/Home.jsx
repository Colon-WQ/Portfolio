import React, { Component } from 'react';
import { connect } from 'react-redux';
import { repopulate_state, log_out_user } from '../actions/LoginAction'
import { clearCurrentWorkFromLocal } from '../actions/PortfolioAction';
import Typography from '@material-ui/core/Typography';
import CssBaseline from '@material-ui/core/CssBaseline';
import { withStyles } from '@material-ui/core/styles';
import { Button, Link } from '@material-ui/core';
import { ReactComponent as ResumateSVG } from '../res/assets/resumate3.svg';
import homeWelcome from '../res/assets/homeWelcome.png';
import workflow from '../res/assets/workflow.png';
import components from '../res/assets/components.png';
import templateImage from '../res/assets/templates.png';
import { RiFileCodeLine } from 'react-icons/ri';
import { withRouter } from 'react-router';
import axios from 'axios';
import { handleErrors } from '../handlers/errorHandler';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Link as RouterLink } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';


/**
 * @file Home component serves as a welcome page to users and provides functionalities that allow
 * user's to login via Github Oauth.
 * 
 * @author Chuan Hao
 * 
 * @see Home
 */

/**
 * Style generator to dynamically adjust styles based on theme provided
 * 
 * @memberof Home
 * @param {Object} theme 
 */
const styles = (theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    overflowX: 'auto',
    // backgroundImage: `url(${sunsetBackground})`,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundAttachment: 'fixed'
  },
  centeredDiv: {
    display: 'flex',
    width: '100%',
    height: '100%',
    padding: '5em',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',

  },
  welcomeDiv: {
    width: '100%',
    height: 'max-content',
    minHeight: '300px',
    display: 'flex',
    flexDirection: 'row',
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    padding: '10vh'
  },
  tutorialDiv: {
    width: '90%',
    height: '100vh',
    display: 'flex',
    flexDirection: 'row',
    textAlign: 'left',
    justifyContent: 'center',
    alignItems: 'left',
    position: 'relative'
  },
  welcomeText: {
    flexGrow: 1,

  },
  portfolioIcon: {
    width: '40vh',
    height: '40vh',
    borderRadius: '20vh',
  },
  featuresDiv: {
    width: '100%',
    height: '70vh',
    flexDirection: 'row',
    // marginBlock: '30px',
    backgroundColor: '#fff',
  },
  fullSize: {
    width: '100%',
    height: '100%',
  },
  floating: {
    zIndex: 1,
  },
  featureRight: {
    marginLeft: 'auto',
    borderRight: 'none'
  },
  featureLeft: {
    marginRight: 'auto',
    borderLeft: 'none'
  },
  featureImg: {
    width: '50%',
    height: 'inherit',
    objectFit: 'contain',
    padding: '30px'
  },
  flexColumn: {
    display: 'flex',
    flexDirection: 'column',
  },
  flexRow: {
    display: 'flex',
    flexDirection: 'row'
  },
  homeButton: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    backgroundColor: 'transparent',
    top: 0,
    left: 0,
    padding: '1%'
  },
  logoFont: {
    fontFamily: 'Helvetica',
    fontSize: '1.5em',
    fontWeight: 'bold'
  },
  autoMargin: {
    margin: 'auto'
  },
  boldFont: {
    fontWeight: 'bold'
  },
  whiteSpacePreLine: {
    whiteSpace: 'pre-line'
  },
  loginButton: {
    width: 'max-content',
    marginRight: '0.5rem'
  },
  welcomeImage: {
    maxWidth: '50%',
    minHeight: '50%',
    maxHeight: '100%'
  },
  sectionDiv: {
    marginInline: 'auto',
    padding: '6vh',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center'
  },
  messageDiv: {
    borderColor: '#000',
    padding: '5vh',
    border: 'solid 1px',
    margin: 'auto',
    marginBottom: '15vh'
  },
  riFileCodeLine: {
    margin: 'auto'
  },
  bottomLogoDiv: {
    backgroundColor: '#000',
    height: '50vh',
    width: '100%',
    alignItems: 'start'
  },
  bottomLogoFill: {
    fill: "#fff"
  },
  boxDiv: {
    width: '15em',
    height: '15em',
    padding: '10px',
    display: 'flex',
    flexDirection: 'column',
    border: 'solid 1px',
    borderColor: theme.palette.primary.main,
    justifyContent: 'center',
    textAlign: 'center',
    margin: '20px'
  },
  linkDiv: {
    marginRight: 'auto',
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'left',
    color: '#fff'
  }
});

/**
 * Home component of Portfolio.
 * 
 * @author Chen En
 * @author Chuan Hao
 * 
 * @component
 */
class Home extends Component {

  /**
   * @constructor
   */
  constructor() {
    super();

    this.state = {
      guestDialogState: false,
    };

    this.handleGuestLogin = this.handleGuestLogin.bind(this);
  }

  /**
   * Attempts to fetch user details and logged in status from localStorage after component is rendered.
   * 
   * @returns void
   * @memberof Home
   */
  async componentDidMount() {
    const localStorageItem = await JSON.parse(window.localStorage.getItem(process.env.REACT_APP_USER_LOCALSTORAGE))
    if (localStorageItem !== null) {
      this.props.repopulate_state(localStorageItem);
    }
  }

  /**
   * Logs out user and then have the user proceed as a guest to dashboard.
   * 
   * @returns void
   * @memberof Home
   */
  async handleGuestLogin() {
    await axios({
      method: 'GET',
      url: process.env.REACT_APP_BACKEND + '/logout',
      withCredentials: true
    }).then(res => {
      //Still necessary if user does not refresh the page.
      this.props.log_out_user();
      this.props.clearCurrentWorkFromLocal();
      //Once cleared, the app will rely on default redux login state if refresh were to occur.
      localStorage.removeItem(process.env.REACT_APP_USER_LOCALSTORAGE);
      console.log("successfully cleared localStorage");
    }).then(() => {
      this.props.history.push("/dashboard");
    }).catch(err => {
      handleErrors(err, this.props.history);
    })
  }

  /**
   * Handles showing and hiding of Guest dialog.
   * 
   * @param {boolean} bool true for show and false for hide.
   * @return void
   * @memberof Home
   */
  handleGuestDialogState(bool) {
    this.setState({
      guestDialogState: bool
    });
  }

  render() {
    const { loggedIn, classes } = this.props;
    return (
      <div className={classes.root}>
        <CssBaseline />
        <Button
          className={classes.homeButton}
          href="/"
        >
          <Typography component="h1" variant="h2" color="inherit" className={`${classes.title} ${classes.logoFont}`}>
            RESUMATE
          </Typography>
        </Button>
        <div className={classes.welcomeDiv}>
          <div className={classes.autoMargin}>
            <ResumateSVG width="15em" height="15em" />
            <Typography component="h2" variant="h2" color="inherit" gutterBottom className={`${classes.typoHeader} ${classes.boldFont}`}>
              {'Show, not tell.'}
            </Typography>
            <Typography component="h3" variant="body1" color="inherit" gutterBottom className={classes.whiteSpacePreLine}>
              {'Sometimes words don\'t do your skills justice.\nShowcase your portfolio in a website you can call your own.'}
            </Typography>
            {loggedIn
              ?
              <Button
                variant="outlined"
                className={classes.loginButton}
                onClick={() => this.props.history.push('/dashboard')}
              >
                TO DASHBOARD
                </Button>
              :
              <Button
                href={`https://github.com/login/oauth/authorize?scope=repo&client_id=` + process.env.REACT_APP_CLIENT_ID}
                variant="outlined"
                className={classes.loginButton}
              >
                GET STARTED
                </Button>
            }
            <Button
              onClick={() => loggedIn ? this.handleGuestDialogState(true) : this.props.history.push('/dashboard')}
              variant="outlined"
              className={classes.loginButton}
            >
              LOGIN AS GUEST
            </Button>
          </div>
        </div>
        <div
          style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}
        >
          <img src={homeWelcome} className={classes.welcomeImage} />
        </div>
        <div
          className={`${classes.featuresDiv} ${classes.centeredDiv}`}
        >

          <div
            className={classes.sectionDiv}
            style={{
              flexDirection: 'column',
              width: '50%'
            }}
          >
            <Typography component="h2" variant="h2" color="inherit" className={classes.title}>
              Creating your online portfolio has never been easier
            </Typography>
            <Typography component="h3" variant="h5" color="inherit" className={classes.title}>
              Easily design and host your ideal portfolio in minutes with our built in tools. All without watermarks or hosting fees — your site is yours to keep.
            </Typography>
          </div>
          <img
            className={classes.featureImg}
            src={components}
            alt="feature"
          />
        </div>
        <div
          className={`${classes.featuresDiv} ${classes.centeredDiv}`}
          style={{
            height: '80vh',
            minHeight: '600px'
          }}
        >
          <img
            className={classes.featureImg}
            src={workflow}
            style={{
              width: '60%',
            }}
            alt="feature"
          />
          <div
            className={` ${classes.sectionDiv}`}
            style={{
              flexDirection: 'column',
              width: '40%',
            }}
          >
            <div
              className={`${classes.fullSize} ${classes.centeredDiv}`}
            >
              <div
                className={`${classes.fullSize} ${classes.centeredDiv}`}
                style={{
                  flexDirection: 'column'
                }}
              >
                <Typography component="h2" variant="h3" color="inherit" className={classes.title}>
                  Personalise your site
                </Typography>
                <Typography component="h3" variant="body1" color="inherit" className={classes.title}>
                  Upload images, edit texts, and more, all from a single editor.
                </Typography>
              </div>
              <div
                className={`${classes.fullSize} ${classes.centeredDiv}`}
                style={{
                  flexDirection: 'column'
                }}
              >
                <Typography component="h2" variant="h3" color="inherit" className={classes.title}>
                  Export your creations
                </Typography>
                <Typography component="h3" variant="body1" color="inherit" className={classes.title}>
                  Download your website as their component files. They're yours to keep, forever.
                </Typography>
              </div>
            </div>
            <div
              className={`${classes.fullSize} ${classes.centeredDiv}`}
            >
              <div
                className={`${classes.fullSize} ${classes.centeredDiv}`}
                style={{
                  flexDirection: 'column'
                }}
              >
                <Typography component="h2" variant="h3" color="inherit" className={classes.title}>
                  Stock image gallery
                </Typography>
                <Typography component="h3" variant="body1" color="inherit" className={classes.title}>
                  Looking for royalty free images? We have that covered, courtesy of Pexels.
                </Typography>
              </div>
              <div
                className={`${classes.fullSize} ${classes.centeredDiv}`}
                style={{
                  flexDirection: 'column'
                }}
              >
                <Typography component="h2" variant="h3" color="inherit" className={classes.title}>
                  Publish your work
                </Typography>
                <Typography component="h3" variant="body1" color="inherit" className={classes.title}>
                  Want to bring your portfolio online? We can help you with that.
                </Typography>
              </div>
            </div>
          </div>
        </div>
        <div
          className={`${classes.featuresDiv} ${classes.centeredDiv}`}
        >
          <div
            className={classes.sectionDiv}
            style={{
              flexDirection: 'column',
              width: '50%'
            }}
          >

            <Typography component="h2" variant="h2" color="inherit" className={classes.title}>
              Take the plunge
            </Typography>
            <Typography component="h3" variant="h5" color="inherit" className={classes.title}>
              Want to know how we made this? How about learning some web development? Check out our tutorials page — add a new skill to your portfolio.
            </Typography>
            <div
              className={classes.flexRow}
            >
              <div
                className={classes.boxDiv}
              >
                <Typography component="h4" variant="h5" color="inherit" className={classes.title}>
                  Introduction to HTML
                </Typography>
                <Typography component="body1" variant="body1" color="inherit" className={classes.title}>
                  Learn what makes up your site — html, css, javascript.
                </Typography>
                <Typography>
                  <Link component={RouterLink} to='/tutorial/guestdeploy'>
                    view
                  </Link>
                </Typography>
              </div>
              <div
                className={classes.boxDiv}
              >
                <Typography component="h4" variant="h5" color="inherit" className={classes.title}>
                  Snake game
            </Typography>
                <Typography component="body1" variant="body1" color="inherit" className={classes.title}>
                  A simple game of snake written in javascript that you can add to your site.
            </Typography>
                <Typography>
                  <Link component={RouterLink} to='/tutorial/snakegame'>
                    view
              </Link>
                </Typography>
              </div>

              <Link component={RouterLink} to='/tutorial'>
                <div
                  className={classes.boxDiv}
                >
                  <FaArrowRight size="5em" style={{ margin: 'auto' }} />
                </div>
              </Link>
            </div>
          </div>
        </div>
        <div className={`${classes.centeredDiv} ${classes.bottomLogoDiv}`}>
          <div
            style={{
              color: '#fff',
              marginRight: '30px'
            }}
          >
            <Typography component="h2" variant="h5">
              Directory
            </Typography>
            <div className={classes.linkDiv}>
              <Typography component="body1" variant="body1">
                <Link component={RouterLink} color="inherit" to='/edit'>
                  Website builder
                </Link>
              </Typography>
              <Typography component="body1" variant="body1">
                <Link component={RouterLink} color="inherit" to='/support'>
                  Support
                </Link>
              </Typography>
              <Typography component="body1" variant="body1">
                <Link component={RouterLink} color="inherit" to='/tutorial'>
                  Tutorials
                </Link>
              </Typography>
              <Typography component="body1" variant="body1">
                <Link component={RouterLink} color="inherit" to='/faq'>
                  FAQ
                </Link>
              </Typography>
            </div>
          </div>
          <div
            style={{
              color: '#fff',
              marginRight: 'auto'
            }}
          >
            <Typography component="h2" variant="h5">
              External
            </Typography>
            <div className={classes.linkDiv}>
              <Typography component="body1" variant="body1">
                <Link href="https://www.pexels.com/" onClick={e => e.preventDefault()} color="inherit">
                  Pexels
                </Link>
              </Typography>
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              color: '#fff'
            }}
          >
            <ResumateSVG width="7em" height="7em" className={classes.bottomLogoFill} />
            <Typography component="body1" variant="body1" color="inherit">
              Resumate 2021
            </Typography>
          </div>

        </div>
        <Dialog
          open={this.state.guestDialogState}
          onClose={() => this.handleGuestDialogState(false)}
          aria-labelledby="guest change permission input"
          disableScrollLock
        >
          <DialogTitle id="guest change permission input">
            Are you sure?
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              Login in as Guest will log you out of your current session. Do you still wish to continue?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => this.handleGuestDialogState(false)}>
              Cancel
            </Button>
            <Button onClick={this.handleGuestLogin}>
              Continue as Guest
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
 * @type {Object.< Function >}
 * @memberof Home
 */
const mapDispatchToProps = {
  repopulate_state,
  log_out_user,
  clearCurrentWorkFromLocal
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(withRouter(Home)));
