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
  nestedParagraph: {
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
        <ul className={classes.paragraph}>
            <li>Using a Guest account instead of the user account means that you do not have access to the automatic Github page deployment service that we provide.</li>
            <li>This would mean some hands-on work on your side to deploy and host your portfolio website.</li>
        </ul>

        <Typography className={classes.header} variant='h5' component='h5'>You have an existing Github account</Typography>
        <Divider orientation="horizontal" className={classes.divider}/>

        <Typography className={classes.subHeader} variant='h6' component='h6'>1. Downloading the zip files for your Portfolio website</Typography>
        <ul className={classes.paragraph}>
            <li>Create your portfolio and once done, click on the Publish button as a Guest.</li>
            <li>A zip file named after your portfolio name will be downloaded.</li>
        </ul>
        <Typography className={classes.subHeader} variant='h6' component='h6'>2. Uploading files to Github repository</Typography>
        <ul className={classes.paragraph}>
            <li>Login to your Github account, then create a new Github repository.</li>
            <div className={classes.nestedParagraph}>
              <li>
                You would have to provide a name for the Github repository. If you are unsure, 
                we recommend you to name it your-github-username.github.io, where your-github-username is your Github account username.
              </li>
              <li>If you name it as your-github-username.github.io, then your portfolio website will be created at https://your-github-username.github.io later</li>
              <li>You may also name your repository as other names, like for example "skills".</li>
              <li>If you name it as "skills", then your portfolio website will be created at https://your-github-username.github.io/skills later</li>
            </div>
            <li>Once the Github repository is created, click on it to open your repository page.</li>
            <li>h</li>
        </ul>
        <span className={classes.paragraphEnd} />
        <Divider orientation="horizontal" className={classes.divider}/>
        <span className={classes.bottomSpace}/>
      </div>
    )
  }
}

export default withStyles(styles)(Guestdeploy);