import React, { Component } from 'react';
import { Typography } from "@material-ui/core";
import Divider from '@material-ui/core/Divider';
import dashboard from '../../../res/assets/support/dashboard.png';
import dashboard2 from '../../../res/assets/support/dashboard2.png';
import dashboard3 from '../../../res/assets/support/dashboard3.png';


class Dashboard extends Component {
  static topic = 'Navigating the dashboard';

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <span className={classes.topSpace} />
        <Typography variant='h2' component='h2'>Dashboard Features</Typography>

        <Typography className={classes.header} variant='h5' component='h5'>For users</Typography>
        <Divider orientation="horizontal" className={classes.divider} />

        <Typography className={classes.subHeader} variant='h6' component='h6'>Creating a portfolio</Typography>
        <ul className={classes.list}>

          <img src={dashboard} alt="dashboard example" className={classes.image}/>

          <li>To create a portfolio, click on the "Add a Portfolio" button.</li>

          <img src={dashboard2} alt="set name dialog example" className={classes.image}/>

          <li>This will open up a dialog asking for the portfolio name. Please provide a unique, non-empty name for your portfolio.</li>
          <li>Once done, click on 'Set Name' to create the portfolio.</li>
        </ul>
        <Typography className={classes.subHeader} variant='h6' component='h6'>Opening existing portfolio</Typography>
        <ul className={classes.list}>
          <li>To open an existing portfolio, you must have an existing portfolio in your Dashboard.</li>
          <li>Click on "Open" button on the portfolio of your choice.</li>
        </ul>
        <Typography className={classes.subHeader} variant='h6' component='h6'>Change portfolio name</Typography>
        <ul className={classes.list}>
          <li>To change portfolio name, you must have an existing portfolio in your Dashboard.</li>
          <li>Click on the edit icon on an existing portfolio to reveal a menu.</li>

          <img src={dashboard3} alt="options menu example" className={classes.image}/>

          <li>Select "Change Name" button.</li>
          <li>This will open up a dialog asking for the new portfolio name. Please provide a unique, non-empty name for your portfolio.</li>
          <li>Once done, click on "Change" button to finalize the changes to portfolio name.</li>
        </ul>
        <Typography className={classes.subHeader} variant='h6' component='h6'>Delete portfolio</Typography>
        <ul className={classes.list}>
          <li>To delete portfolio, you must have an existing portfolio in your Dashboard.</li>
          <li>Click on the edit icon on an existing portfolio to reveal a menu.</li>
          <li>Select "Delete" button.</li>
          <li>This will open up a dialog asking for your confirmation.</li>
          <li>Click on "Delete" button to confirm. This delete action is irreversible.</li>
        </ul>
        <span className={classes.listEnd} />
        <Divider orientation="horizontal" className={classes.divider} />

        <Typography className={classes.header} variant='h5' component='h5'>For guests</Typography>
        <Divider orientation="horizontal" className={classes.divider} />
        <Typography className={classes.subHeader} variant='h6' component='h6'>Creating a portfolio</Typography>
        <ul className={classes.list}>
          <li>To create a portfolio, click on the "Add a Portfolio" button.</li>
          <li>This will open up a dialog asking for the portfolio name. Please provide a non-empty name for your portfolio.</li>
          <li>Once done, click on 'Set Name' to create the portfolio.</li>
        </ul>
        <Typography className={classes.subHeader} variant='h6' component='h6'>Opening existing portfolio</Typography>
        <ul className={classes.list}>
          <li>Guests can only have 1 portfolio at a time, unlike users.</li>
          <li>Click on "Continue editing your-portfolio-name" button to open your existing portfolio.</li>
        </ul>
        <span className={classes.listEnd} />
        <Divider orientation="horizontal" className={classes.divider} />
        <span className={classes.bottomSpace} />
      </div>
    )
  }
}

export default Dashboard;