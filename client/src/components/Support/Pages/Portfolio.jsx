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

        <Typography variant='h2' component='h2'>Portfolio</Typography>
        <Divider orientation="horizontal" className={classes.divider}/>
        <ul className={classes.paragraph}>
            <li>The Portfolio page shows a preview of the user's portfolio website and provides tools to edit the website.</li>
        </ul>
        <Divider orientation="horizontal" className={classes.divider}/>

        <Typography variant='h5' component='h5'>Tool Panel</Typography>
        <Divider orientation="horizontal" className={classes.divider}/>
        <Typography variant='h6' component='h6'>Save</Typography>
        <ul className={classes.paragraph}>
            <li>Save button allows for manual saving of current portfolio work.</li>
            <li>A 30s countdown to autosave will begin after every edit to portfolio.</li>
            <li>
                If the user intends to navigate away from the page with unsaved work by the back navigation button or by other navbar buttons, an alert prompt will
                ask the user to either discard or save unsaved work before leaving the portfolio page.
            </li>
        </ul>
        <Divider orientation="horizontal" className={classes.divider}/>
        
        <Typography variant='h6' component='h6'>Add Entry</Typography>
        <ul className={classes.paragraph}>
            <li>Add Entry button allows user to add prebuilt components/templates into their portfolio.</li>
            <li>Clicking on the Add Entry button will open an interface where the user can browse the available templates</li>
            <li>Select a template to add it into your portfolio</li>
        </ul>
        <Divider orientation="horizontal" className={classes.divider}/>

        <Typography variant='h6' component='h6'>Manage Directory</Typography>
        <ul className={classes.paragraph}>
            <li>Manage Directory button allows user to manage pages within their portfolio</li>
            <li>
                What are pages? The pages we are referring to are your portfolio website's pages. The default page in which you currently have would be your root page
                and is available at https://your-github-username.github.io/, where your-github-username is your Github username.
                Suppose you were to add a page called 'skills', then it would be displayed if you visit https://your-github-username.github.io/skills.
            </li>
            <li>If you have multiple pages, then it would be a directory. The Manage Directory button will open an interface that allows the user to add, delete and rename pages.</li>
        </ul>
        <Divider orientation="horizontal" className={classes.divider}/>

        <Typography variant='h6' component='h6'>Publish for Users</Typography>
        <ul className={classes.paragraph}>
            <li>
                For users, the Publish button will open a dialog asking for the user to input a name for the Github repository they wish to use. 
                If the Github repository does not exist, it will be created.
                The name input is by default the root repository of the user's Github page.
            </li>
            <li>
                Once done, click on the Finalize button. If the name provided matches a Github repository already owned by the user, another dialog will show asking the user
                for permission to override the contents in the existing Github repository.
            </li>
        </ul>
        <Divider orientation="horizontal" className={classes.divider}/>

        <Typography variant='h6' component='h6'>Publish for Guests</Typography>
        <ul className={classes.paragraph}>
            <li>For guests, the Publish button will download a zip file of the portfolio.</li>
            <li>To find out how to build and host your own portfolio website using this zip file, look into tutorial for a quick guide.</li>
        </ul>
        <Divider orientation="horizontal" className={classes.divider}/>

        <span className={classes.bottomSpace}/>
      </div>
    )
  }
}

export default withStyles(styles)(Portfolio);