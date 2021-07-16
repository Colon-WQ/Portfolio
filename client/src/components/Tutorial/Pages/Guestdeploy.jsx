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
    backgroundColor: 'white',
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
  },
  topSpace: {
    height: '1vh'
  },
  bottomSpace: {
    height: '10vh'
  }
})

class Guestdeploy extends Component {
  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <span className={classes.topSpace}/>
        <Typography variant='h2' component='h2'>Guest Deploy</Typography>

        <Typography className={classes.header} variant='h5' component='h5'>For users</Typography>
        <Divider orientation="horizontal" className={classes.divider}/>

        <Typography className={classes.header} variant='h5' component='h5'>For guests</Typography>
        <Divider orientation="horizontal" className={classes.divider}/>
        <Typography className={classes.subHeader} variant='h6' component='h6'>Creating a portfolio</Typography>
        <ul className={classes.paragraph}>
            <li>To create a portfolio, click on the "Add a Portfolio" button.</li>
            <li>This will open up a dialog asking for the portfolio name. Please provide a non-empty name for your portfolio.</li>
            <li>Once done, click on 'Set Name' to create the portfolio.</li>
        </ul>
        <Typography className={classes.subHeader} variant='h6' component='h6'>Opening existing portfolio</Typography>
        <ul className={classes.paragraph}>
            <li>Guests can only have 1 portfolio at a time, unlike users.</li>
            <li>Click on "Continue editing your-portfolio-name" button to open your existing portfolio</li>
        </ul>
        <span className={classes.paragraphEnd} />
        <Divider orientation="horizontal" className={classes.divider}/>
        <span className={classes.bottomSpace}/>
      </div>
    )
  }
}

export default withStyles(styles)(Guestdeploy);