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

class Portfolio extends Component {
  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <span className={classes.topSpace}/>

        <Typography variant='h2' component='h2'>Introduction</Typography>
        <Divider orientation="horizontal" className={classes.divider}/>

        <Typography variant='h5' component='h5'>User Login</Typography>
        <Divider orientation="horizontal" className={classes.divider}/>
        <Typography variant='h6' component='h6'>Prerequisites</Typography>
        <ul className={classes.paragraph}>
            <li>To login as User, you must have an existing Github account</li>
            <li>In the Home page, click on "Get Started" button</li>
            <li>You will be taken to Github login page, then to our Github OAuth page</li>
            <li>Grant permissions to our OAuth page to allow us to build your portfolio website for you</li>
        </ul>
        <Divider orientation="horizontal" className={classes.divider}/>
        

        <span className={classes.bottomSpace}/>
      </div>
    )
  }
}

export default withStyles(styles)(Portfolio);