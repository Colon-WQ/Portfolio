import React, { Component } from 'react';
import { Typography, withStyles } from "@material-ui/core";
import Divider from '@material-ui/core/Divider';
import login from '../Assets/login.png';


class Introduction extends Component {
  static topic = 'Logging in';

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <span className={classes.topSpace} />

        <Typography variant='h2' component='h2'>Introduction</Typography>

        <Typography className={classes.header} variant='h5' component='h5'>User Login</Typography>
        <Divider orientation="horizontal" className={classes.divider} />

        <Typography className={classes.subHeader} variant='h6' component='h6'>Prerequisites</Typography>
        <ul className={classes.list}>
          <li>To login as User, you must have an existing Github account.</li>
          <li>In the Home page, click on "Get Started" button.</li>
          <div className={classes.imageContainer}>
            <img src={login} alt="login example" />
          </div>
          <li>You will be taken to Github login page, then to our Github OAuth page.</li>
          <li>Grant permissions to our OAuth page by clicking Authorize Colon-WQ to allow us to build your portfolio website for you.</li>
        </ul>

        <Typography variant='h6' component='h6'>User Features</Typography>
        <ul className={classes.list}>
          <li>No extra work has to be done to build and host the portfolio website, we will handle everything behind the scenes.</li>
          <li>Multiple portfolios can be saved and managed. User can update their portfolio website easily overtime.</li>
        </ul>
        <span className={classes.listEnd} />
        <Divider orientation="horizontal" className={classes.divider} />

        <Typography className={classes.header} variant='h5' component='h5'>Guest Login</Typography>
        <Divider orientation="horizontal" className={classes.divider} />
        <Typography className={classes.subHeader} variant='h6' component='h6'>Prerequisites</Typography>
        <ul className={classes.list}>
          <li>To login as Guest, there are no requirements.</li>
          <li>In the Home page, click on "Login as Guest" button.</li>
        </ul>

        <Typography variant='h6' component='h6'>Guest Features</Typography>
        <ul className={classes.list}>
          <li>Extra work has to be done by the user to build and host the portfolio website.</li>
          <li>No portfolio saving. User has to rebuild the portfolio from ground up everytime.</li>
        </ul>
        <span className={classes.listEnd} />
        <Divider orientation="horizontal" className={classes.divider} />

        <span className={classes.bottomSpace} />
      </div>
    )
  }
}

export default Introduction;
