import React, { Component } from 'react';
import { Typography, withStyles } from "@material-ui/core";
import Divider from '@material-ui/core/Divider';

const styles = theme => ({
  root: {
    display: 'flex', 
    flexDirection: 'column',
    justifyContent: 'start',
    alignItems: 'center'
  },
  header: {
    color: theme.palette.text.secondary,
    marginTop: '1rem',
    marginBottom: '1rem'
  },
  subHeader: {
    color: theme.palette.text.main,
    marginTop: '0.5rem',
    marginBottom: '0.5rem'
  },
  paragraph: {
    backgroundColor: theme.palette.background.light,
    width: '85%',
    height: 'auto',
    borderStyle: 'solid',
    borderColor: 'black',
    borderWidth: 'thin',
    padding: '1rem',
    paddingLeft: '2rem'
  },
  paragraphEnd: {
    height: '1rem'
  },
  divider: {
    width: '100%',
    marginBottom: '1rem'
  },
  topSpace: {
    height: '1vh'
  },
  bottomSpace: {
    height: '10vh'
  }
})

class Introduction extends Component {
  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <span className={classes.topSpace}/>

        <Typography variant='h2' component='h2'>Introduction</Typography>

        <Typography className={classes.header} variant='h5' component='h5'>User Login</Typography>
        <Divider orientation="horizontal" className={classes.divider}/>

        <Typography className={classes.subHeader} variant='h6' component='h6'>Prerequisites</Typography>
        <ul className={classes.paragraph}>
            <li>To login as User, you must have an existing Github account.</li>
            <li>In the Home page, click on "Get Started" button.</li>
            <li>You will be taken to Github login page, then to our Github OAuth page.</li>
            <li>Grant permissions to our OAuth page to allow us to build your portfolio website for you.</li>
        </ul>

        <Typography variant='h6' component='h6'>User Features</Typography>
        <ul className={classes.paragraph}>
            <li>No extra work has to be done to build and host the portfolio website, we will handle everything behind the scenes.</li>
            <li>Multiple portfolios can be saved and managed. User can update their portfolio website easily overtime.</li>
        </ul>
        <span className={classes.paragraphEnd}/>
        <Divider orientation="horizontal" className={classes.divider}/>

        <Typography className={classes.header} variant='h5' component='h5'>Guest Login</Typography>
        <Divider orientation="horizontal" className={classes.divider}/>
        <Typography className={classes.subHeader} variant='h6' component='h6'>Prerequisites</Typography>
        <ul className={classes.paragraph}>
            <li>To login as Guest, there are no requirements.</li>
            <li>In the Home page, click on "Login as Guest" button.</li>
        </ul>
        
        <Typography variant='h6' component='h6'>Guest Features</Typography>
        <ul className={classes.paragraph}>
            <li>Extra work has to be done by the user to build and host the portfolio website.</li>
            <li>No portfolio saving. User has to rebuild the portfolio from ground up everytime.</li>
        </ul>
        <span className={classes.paragraphEnd}/>
        <Divider orientation="horizontal" className={classes.divider}/>

        <span className={classes.bottomSpace}/>
      </div>
    )
  }
}

export default withStyles(styles)(Introduction);
