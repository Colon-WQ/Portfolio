import React, { Component } from 'react';
import { Typography, withStyles } from "@material-ui/core";
import Divider from '@material-ui/core/Divider';
import navigation from '../Assets/navigate.png';
import navigationScript from '../Assets/navigateScript.png';

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
  imageContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  link: {
    color: theme.palette.primary.main,
    textDecoration: 'underline',
    '&:hover': {
      color: theme.palette.primary.light
    }
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

class Navigation extends Component {
  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <span className={classes.topSpace}/>
        <Typography variant='h2' component='h2'>Navigation</Typography>
        <ul className={classes.paragraph}>
            <li>You can add buttons to navigate to your other portfolio pages.</li>
        </ul>

        <Typography className={classes.header} variant='h5' component='h5'>Obtaining the files needed</Typography>
        <Divider orientation="horizontal" className={classes.divider}/>

        <Typography className={classes.subHeader} variant='h6' component='h6'>User</Typography>
        <div className={classes.paragraph}>
            <li>If you had created your portfolio website as a user, you would need to open your Github account.</li>
            <li>Recall the name of the Github repository that you pushed your portfolio files to when creating your portfolio website.</li>
            <div className={classes.nestedParagraph}>
                <li>If you forgot, just check your website link. Assume that your-github-username is your Github username here.</li>
                <li>If your portfolio website is https://your-github-username.github.io, then your Github repository is "your-github-username.github.io".</li>
                <li>
                    If your portfolio website is https://your-github-username.github.io/skills or https://your-github-username.github.io/skills/.../..., then
                    your Github repository in this case is "skills".
                </li>
            </div>
            <li>In your Github account, open the Github repository, then click on the green Code button. Select download ZIP.</li>
            <li>Your portfolio website files will be downloaded as a zip. Extract it into a folder and remember the name of the folder. It will be used later.</li>
            <li>In this folder, click on the index.html. A tab in your browser will open, allowing you to view edits made to your web page.</li>
            <li>Take note that to view any changes made, the web page would have to be refreshed.</li>
        </div>

        <Typography className={classes.subHeader} variant='h6' component='h6'>Guest</Typography>
        <div className={classes.paragraph}>
            <li>If your are guest, you would have downloaded a zip file from publishing your portfolio website.</li>
            <li>Extract the contents of the zip file into a folder and remember the name of the folder. It will be used later.</li>
            <li>In this folder, click on the index.html. A tab in your browser will open, allowing you to view edits made to your web page.</li>
            <li>Take note that to view any changes made, the web page would have to be refreshed.</li>
        </div>
        
        <span className={classes.paragraphEnd} />
        <Divider orientation="horizontal" className={classes.divider}/>

        <Typography className={classes.header} variant='h5' component='h5'>Adding the button</Typography>
        <div className={classes.paragraph}>
            <li>To do this, we will have to open up the index.html. In this case, suppose we want to navigate from the root directory to the "skills" directory.</li>
            <li>This would mean that you have created a nested directory called "skills" while creating your portfolio website. In your folder, you will see another folder called "skills"</li>
            <li>In the main folder, open up index.html using a text editor of your choice.</li>
            <div className={classes.imageContainer}>
                <img src={navigation} alt="button example" />
            </div>
            <li>Find a suitable spot in the index.html and slot in this button element.</li>
            <li>Notice that we have added an id attribute to this button. This is so that we can reference it in a javascript file later.</li>
            <li>Once you've added it in, click on the index.html. Your browser will show your changed portfolio website.</li>
            <li>
                You may notice that the button is not positioned the way you wish it to be. 
                We recommend that you look into <a href="https://css-tricks.com/snippets/css/a-guide-to-flexbox/" target="_blank" rel="noopener noreferrer">https://css-tricks.com/snippets/css/a-guide-to-flexbox/</a> and
                then edit styles.css in the same folder to edit the look of the button.
            </li>
        </div>

        <Typography className={classes.header} variant='h5' component='h5'>Adding button logic</Typography>
        <div className={classes.paragraph}>
            <li>We have to add logic to the button on user click.</li>
            <li>To do so, in the same folder, open the scripts.js, which should already be created for you.</li>
            <li>You may notice some existing code that we have created in it for you already. Scroll down to make your own changes.</li>
            <div className={classes.imageContainer}>
                <img src={navigationScript} alt="button logic example" />
            </div>
            <li>
                In this example, we used a css selector to select the first element with id of "navigate-skills-button" in the DOM. 
                Read more about css selectors here. <a href="https://www.w3schools.com/cssref/css_selectors.asp" target="_blank" rel="noopener noreferrer">https://www.w3schools.com/cssref/css_selectors.asp</a>.
            </li>
            <li>We then attached an event listener to the button, which listens for the "click" event and then changes the pathname of the browser to "/skills".</li>
            <li>Click on the index.html to view changes in browser. If you have a folder called "skills", it is likely that we have already created an index.html for you in the folder.</li>
            <li>Clicking on the "Skills" button that you just created should cause the page to rerender using the index.html in the "skills" folder instead.</li>
        </div>

        <Typography className={classes.header} variant='h5' component='h5'>Further practice</Typography>
        <div className={classes.paragraph}>
            <li>
                Now that we have shown you how to create a navigation button, you can try creating another navigation button in the index.html of the "skills" folder.
                Add logic to it such that it takes you back to the home page instead.
            </li>
            <li>Hint: The pathname should now be "/"</li>
        </div>
        <span className={classes.paragraphEnd} />
        <Divider orientation="horizontal" className={classes.divider}/>
        <span className={classes.bottomSpace}/>
      </div>
    )
  }
}

export default withStyles(styles)(Navigation);