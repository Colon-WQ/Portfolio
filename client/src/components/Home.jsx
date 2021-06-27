import React, { Component } from 'react';
import { connect } from 'react-redux';
import { repopulate_state } from '../actions/LoginAction'
import Typography from '@material-ui/core/Typography';
import CssBaseline from '@material-ui/core/CssBaseline';
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import { Button, List, ListItem } from '@material-ui/core';
import { theme } from '../styles/styles';
import { ReactComponent as ResumateSVG } from '../res/assets/resumate3.svg';
import homeWelcome from '../res/assets/homeWelcome.png';
import sunsetBackground from '../res/assets/sunset.png';
import { RiFileCodeLine } from 'react-icons/ri';


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
    backgroundImage: `url(${sunsetBackground})`,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundAttachment: 'fixed'
  },
  centeredDiv: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
  welcomeDiv: {
    width: '100%',
    height: '100vh',
    display: 'flex',
    flexDirection: 'row',
    textAlign: 'left',
    justifyContent: 'center',
    alignItems: 'left',
    position: 'relative'
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
  typoHeader: {
  },
  typoSubtitle: {

  },

  portfolioIcon: {
    width: '40vh',
    height: '40vh',
    borderRadius: '20vh',
  },
  featuresDiv: {
    position: 'relative',
    width: '80vw',
    height: '70vh',
    flexDirection: 'row',
    marginBlock: '10vh',
    backgroundColor: 'transparent',
    borderWidth: '1px',
    borderStyle: 'solid'
  },
  boxShadow: {
    zIndex: '-1',
    top: '5vh',
    left: '-5vh',
    width: '100%',
    height: '100%',
    position: 'absolute'
  },
  // boxShadowLeft: {
  //   marginLeft: 'auto',
  //   boxShadow: '-5vh 5vh #00000044, calc(80vw - 5vh) 5vh #00000044',
  // },
  // boxShadowRight: {
  //   marginRight: 'auto',
  //   boxShadow: '-5vh 5vh #00000044',
  // },
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
    objectFit: 'cover',
    maxHeight: '90%',
    maxWidth: '90%',
    margin: '5vh'
  },
  flexColumn: {
    display: 'flex',
    flexDirection: 'column',
  },
  flexRow: {
    display: 'flex',
    flexDirection: 'row'
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
  }

  /**
   * Attempts to fetch user details and logged in status from localStorage after component is rendered.
   * 
   * @returns void
   * @memberof Home
   */
  async componentDidMount() {
    if (!this.props.loggedIn) {
      const localStorageItem = await JSON.parse(window.localStorage.getItem(process.env.REACT_APP_USER_LOCALSTORAGE))
      if (localStorageItem !== null) {
        this.props.repopulate_state(localStorageItem);
      }
    }
  }

  render() {
    const { loggedIn, classes } = this.props;
    return (
      <div className={classes.root}>
        <CssBaseline />
        <Button
          style={
            {
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'absolute',
              backgroundColor: 'transparent',
              top: 0,
              left: 0,
              padding: '1%'
            }
          }
          href="/"
        >
          <ResumateSVG width="2em" height="2em" />
          <Typography component="h1" variant="h2" color="inherit" className={classes.title} style={{ fontFamily: 'Helvetica', fontSize: '1.5em', fontWeight: 'bold' }}>
            RESUMATE
          </Typography>
        </Button>
        <div className={classes.welcomeDiv}>
          <div
            style={
              {
                margin: 'auto'
              }
            }>
            <Typography component="h2" variant="h2" color="inherit" gutterBottom className={classes.typoHeader} style={{ fontWeight: 'bold' }}>
              {'Show, not tell.'}
            </Typography>
            <Typography component="h6" variant="subtitle1" color="inherit" gutterBottom style={{ whiteSpace: 'pre-line' }}>
              {'Sometimes words don\'t do your accomplishments justice.\nShowcase your best work in a visual, interactive website.'}
            </Typography>
            <Button
              href={loggedIn
                ? '/dashboard'
                : `https://github.com/login/oauth/authorize?scope=repo&client_id=` + process.env.REACT_APP_CLIENT_ID}
              variant="outlined"
              style={{ width: 'max-content' }}
            >
              GET STARTED
          </Button>
          </div>
          <img src={homeWelcome} style={{ marginRight: 'auto', maxWidth: '50%', minHeight: '50%', maxHeight: '100%' }} />
        </div>
        <div
          className={`${classes.featuresDiv} ${classes.centeredDiv} ${classes.featureRight}`}
        >
          <img
            className={classes.featureImg}
            style={{ marginInline: '5vh' }}
            src="https://edut.to/2TeoUBz"
            alt="feature"
          />
          <div
            style={{ marginInline: 'auto', maxWidth: '50%', padding: '6vh' }}
            className={classes.flexColumn}
          >
            <Typography component="h4" variant="h4" color="inherit" className={classes.title}>
              Pre-Built templates
            </Typography>
            <Typography component="body1" variant="body1" color="inherit" className={classes.title}>
              Not a designer? No worries, choose from a selection of templates
            </Typography>
          </div>
          <div
            className={classes.boxShadow}
            style={{
              backgroundColor: '#FEF9C7'
            }}
          />
        </div>
        <div
          className={`${classes.featuresDiv} ${classes.centeredDiv} ${classes.featureLeft}`}
        >
          <div
            style={{ marginInline: 'auto', maxWidth: '50%', padding: '6vh' }}
            className={classes.flexColumn}
          >
            <Typography component="h4" variant="h4" color="inherit" className={classes.title}>
              Free forever, no watermarks
          </Typography>
            <Typography component="body1" variant="body1" color="inherit" className={classes.title}>
              You own your website. No watermarks, no restrictions. Take full control of your website.
          </Typography>
          </div>
          <img
            className={classes.featureImg}
            style={{ marginInline: '5vh' }}
            src="https://edut.to/2TeoUBz"
            alt="feature"
          />
          <div
            className={classes.boxShadow}
            style={{
              backgroundColor: '#FCE181'
            }}
          />
        </div>
        <div
          className={`${classes.featuresDiv} ${classes.centeredDiv} ${classes.featureRight}`}
        >
          <img
            className={classes.featureImg}
            style={{ marginInline: '5vh' }}
            src="https://edut.to/2TeoUBz"
            alt="feature"
          />
          <div
            style={{ marginInline: 'auto', maxWidth: '50%', padding: '6vh' }}
            className={classes.flexColumn}
          >
            <Typography component="h4" variant="h4" color="inherit" className={classes.title}>
              Fuss free process
          </Typography>
            <Typography component="body1" variant="body1" color="inherit" className={classes.title}>
              Pick your templates, edit your entries. We'll handle the rest — compilation and hosting all by us.
          </Typography>
          </div>
          <div
            className={classes.boxShadow}
            style={{
              backgroundColor: '#9FEDD7'
            }}
          />
        </div>
        <div className={`${classes.flexRow}`} style={{ borderColor: '#000', padding: '5vh', border: 'solid 1px', margin: 'auto', marginBottom: '15vh' }}>
          <RiFileCodeLine size="20em" style={{ margin: 'auto' }} />
          <div
            style={
              {
                margin: 'auto',
              }
            }>
            <Typography component="h3" variant="h3" color="inherit" gutterBottom className={classes.typoHeader} style={{ fontWeight: 'bold' }}>
              Ready to take it a step further?
            </Typography>
            <Typography component="h6" variant="subtitle1" color="inherit" gutterBottom style={{ whiteSpace: 'pre-line' }}>
              {'You\'ve got your website up and running.\n How about giving web development a shot? \n Beginner javascript projects to advanced full stack tutorials, we have it all.'}
            </Typography>
            <Button
              href="/"
              onClick={() => alert('Coming soon in the near future!')}
              color="primary"
              variant="outlined"
            >
              Browse tutorials
          </Button>
          </div>

          <div
            className={classes.boxShadow}
            style={{
              backgroundColor: '#026670'
            }}
          />
        </div>
        <div style={{ backgroundColor: '#000', height: '50vh', width: '100%' }} className={classes.centeredDiv}>
          <ResumateSVG width="7em" height="7em" style={{ fill: "#fff" }} />
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
