import React, { Component } from 'react';
import { Typography, withStyles } from "@material-ui/core";
import Divider from '@material-ui/core/Divider';
import directoryManager from '../Assets/directoryManager.png';
import directoryManager2 from '../Assets/directoryManager2.png';
import directoryManager3 from '../Assets/directoryManager3.png';
import directoryManager4 from '../Assets/directoryManager4.png';

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
  warning: {
    color: 'red'
  },
  divider: {
    width: '100%',
  },
  topSpace: {
    height: '1vh'
  },
  bottomSpace: {
    height: '10vh'
  },
  image: {
    width: '80%',
    height: 'auto'
  }
})

class Directorymanager extends Component {
  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <span className={classes.topSpace}/>

        <Typography variant='h2' component='h2'>Directory Manager</Typography>

        <Typography className={classes.header} variant='h5' component='h5'>Accessing the Directory Manager</Typography>
        <ul className={classes.paragraph}>
            <li>To access the Directory Manager, click on Directories button in the tool panel at the bottom right of the screen.</li>
            <div className={classes.imageContainer}>
              <img src={directoryManager} alt="directoryManager interface example" className={classes.image} />
            </div>
            <li>This will open up the Directory Manager interface where you will see the root button by default.</li>
            <div className={classes.nestedParagraph}>
              <li>The root button represents a page. If you have just created the portfolio, the page you are currently on would be the root page.</li>
              <li>Suppose your Github page is https://your-github-username.github.io, then the root page would be accessible at https://your-github-username.github.io/.</li>
            </div>
        </ul>

        <Typography className={classes.header} variant='h5' component='h5'>Adding a new page</Typography>
        <ul className={classes.paragraph}>
            <li>In the Directory Manager, click on NEW PAGE button at the bottom right of the interface.</li>
            <div className={classes.imageContainer}>
              <img src={directoryManager2} alt="directoryManager new page example" />
            </div>
            <li>The NEW PAGE button will change to CREATE button and an input box will show, where you can name your page.</li>
            <li>Once done providing a name for your new page, click on CREATE button.</li>
            <li>Notice that the root button now has a "+" sign, click on it.</li>
            <div className={classes.imageContainer}>
              <img src={directoryManager3} alt="directoryManager expand example" />
            </div>
            <li>The button will expand downwards to show another button. Suppose you named your page "skills". The new button will be called "skills".</li>
            <li>Click on the "skills" button and your page will change to display the newly created page.</li>
            <div className={classes.imageContainer}>
              <img src={directoryManager4} alt="directoryManager navigation example" />
            </div>
        </ul>

        <Typography className={classes.header} variant='h5' component='h5'>Navigating through the directory</Typography>
        <ul className={classes.paragraph}>
            <li>Suppose you are now at a new page that you just created, called "skills".</li>
            <li>Open the Directory Manager, click on the root button to expand it if it is not already expanded.</li>
            <li>Click on the page that you wish to navigate to. It will be highlighted.</li>
            <li>Close the Directory Manager by clicking on the x button in the top right, or click away from the interface. Your page will change to that of the page you selected.</li>
        </ul>

        <Typography className={classes.header} variant='h5' component='h5'>Deleting a page</Typography>
        <ul className={classes.paragraph}>
            <li>Suppose you have just created a new page.</li>
            <li>Open the Directory Manager, click on the root button to expand it if it is not already expanded.</li>
            <li>Click on the page that you wish to delete. It will be highlighted.</li>
            <li>Click on DELETE PAGE button at the bottom right of the interface. The page will be deleted.</li>
            <li>
              <span className={classes.warning}>*This delete action is irreversible. Once the page is deleted, it cannot be recovered. Think twice before proceeding with the delete.*</span>
            </li>
        </ul>

        <Typography className={classes.header} variant='h5' component='h5'>Renaming a page</Typography>
        <ul className={classes.paragraph}>
            <li>Suppose you have just created a new page.</li>
            <li>Open the Directory Manager, click on the root button to expand it if it is not already expanded.</li>
            <li>Click on the page that you wish to rename. It will be highlighted.</li>
            <li>Click on RENAME PAGE button at the bottom right of the interface</li>
            <li>An input box will show, where you can input the new name of your page.</li>
            <li>Once done, click on RENAME PAGE button again. You will see that the name of the page you selected has been changed.</li>
        </ul>
        <span className={classes.paragraphEnd} />
        <Divider orientation="horizontal" className={classes.divider}/>

        <span className={classes.bottomSpace}/>
      </div>
    )
  }
}

export default withStyles(styles)(Directorymanager);