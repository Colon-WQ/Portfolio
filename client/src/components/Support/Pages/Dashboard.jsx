import React, { Component } from 'react'
import { Typography, withStyles } from "@material-ui/core"

const styles = theme => ({
  root: {
    display: 'flex', 
    flexDirection: 'column',
    justifyContent: 'start',
    alignItems: 'center'
  }
})

class Dashboard extends Component {
  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <Typography variant='h4' component='h4'>Dashboard Features</Typography>
        <Typography variant='h5' component='h5'>For users</Typography>
        <Typography variant='h6' component='h6'>Creating a portfolio</Typography>
        <ul>
            <li>To create a portfolio, click on the "Add a Portfolio" button.</li>
            <li>This will open up a dialog asking for the portfolio name. Please provide a unique, non-empty name for your portfolio.</li>
            <li>Once done, click on 'Set Name' to create the portfolio.</li>
        </ul>
        <Typography variant='h6' component='h6'>Opening existing portfolio</Typography>
        <ul>
            <li>To open an existing portfolio, you must have an existing portfolio in your Dashboard</li>
            <li>Click on "Open" button on the portfolio of your choice</li>
        </ul>
        <Typography variant='h6' component='h6'>Change portfolio name</Typography>
        <ul>
            <li>To change portfolio name, you must have an existing portfolio in your Dashboard.</li>
            <li>Click on the edit icon on an existing portfolio to reveal a menu.</li>
            <li>Select "Change Name" button.</li>
            <li>This will open up a dialog asking for the new portfolio name. Please provide a unique, non-empty name for your portfolio.</li>
            <li>Once done, click on "Change" button to finalize the changes to portfolio name.</li>
        </ul>
        <Typography variant='h6' component='h6'>Delete portfolio</Typography>
        <ul>
            <li>To delete portfolio, you must have an existing portfolio in your Dashboard.</li>
            <li>Click on the edit icon on an existing portfolio to reveal a menu.</li>
            <li>Select "Delete" button.</li>
            <li>This will open up a dialog asking for your confirmation.</li>
            <li>Click on "Delete" button to confirm. This delete action is irreversible.</li>
        </ul>

        <Typography variant='h5' component='h5'>For guests</Typography>
        <Typography variant='h6' component='h6'>Creating a portfolio</Typography>
        <ul>
            <li>Same as user</li>
        </ul>
        <Typography variant='h6' component='h6'>Opening existing portfolio</Typography>
        <ul>
            <li>Guests can only have 1 portfolio at a time, unlike users.</li>
            <li>Click on "Continue editing your-portfolio-name" button to open your existing portfolio</li>
        </ul>
      </div>
    )
  }
}

export default withStyles(styles)(Dashboard);