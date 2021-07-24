import React, { Component } from 'react';
import { Typography } from "@material-ui/core";
import Divider from '@material-ui/core/Divider';
import login from '../Assets/login.png';
import dashboard2 from '../Assets/dashboard2.png';
import toolPanel from '../Assets/toolPanel.png';
import entryEditor from '../Assets/entryEditor.png';
import entryEditor2 from '../Assets/entryEditor2.png';
import entryEditor3 from '../Assets/entryEditor3.png';
import publish from '../Assets/publish.png';
import publish2 from '../Assets/publish2.png';


class Gettingstarted extends Component {
  static topic = 'Getting Started';

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <span className={classes.topSpace} />

        <Typography variant='h2' component='h2'>Getting Started</Typography>

        <Typography className={classes.header} variant='h5' component='h5'>User Guide</Typography>
        <Divider orientation="horizontal" className={classes.divider} />

        <Typography className={classes.subHeader} variant='h6' component='h6'>1. Login as User</Typography>
        <ul className={classes.list}>
          <li>To login as User, you must have an existing Github account.</li>
          <li>In the Home page, click on "Get Started" button.</li>
          <img src={login} alt="login example" className={classes.image}/>
          <li>You will be taken to Github login page, then to our Github OAuth page.</li>
          <li>Grant permissions to our OAuth page by clicking Authorize Colon-WQ to allow us to build your portfolio website for you.</li>
          <li>Once done, you will be redirected to DashBoard.</li>
        </ul>

        <Typography variant='h6' component='h6'>2. Create a portfolio</Typography>
        <ul className={classes.list}>
          <li>Once in Dashboard, if you are a new user: </li>
          <div className={classes.nestedList}>
            <li>You’ll likely see no existing Portfolios.</li>
            <li>Since you are a new user, a guided application tour will automatically start. To continue with this user guide instead, click on the skip button on the tour step.</li>
            <li>
                Then, click on Add a Portfolio button to create one. You will need to provide a unique and non-empty name for your new portfolio. 
                Click on Set Name button to confirm the name. You will then be redirected to your Portfolio page.
            </li>
            <img src={dashboard2} alt="set name dialog example" className={classes.image}/>
          </div>
          <li>If you are an existing user: </li>
          <div className={classes.nestedList}>
            If you are an existing user, you may have existing Portfolios. To edit existing Portfolios, click on open button. You will be redirected to your Portfolio page.
          </div>
          <li>Once done, you will be redirected to the portfolio page.</li>
        </ul>
        <span className={classes.listEnd} />

        <Typography variant='h6' component='h6'>3. Edit the portfolio</Typography>
        <ul className={classes.list}>
            <li>Once in portfolio page, at the bottom left of the screen, there will be a tool panel. Click on new entry button to choose a template.</li>
            <img src={toolPanel} alt="toolPanel example" className={classes.image}/>
            <li>The template selector interface will show, allowing you to pick a prebuilt component to add to your Portfolio.</li> 
            <li>Click on a template to add it to your portfolio.</li>
            <li>Once the template is chosen, the entry will show up on your screen. Hover your mouse over the entry to reveal the settings button.</li>
            <img src={entryEditor} alt="entryEditor settings example" className={classes.image} />
            <li>Click on the settings button to show 2 additional buttons, Edit entry and Delete entry. Click on Edit Entry button.</li>
            <img src={entryEditor2} alt="edit entry/delete entry example" className={classes.image}/>
            <li>The Entry Editor interface will show, allowing you to change various aspects of the template. Click on whichever property you wish to change.</li>
            <img src={entryEditor3} alt="entryEditor interface example" className={classes.image} />
            <li>
                Once done with editing, click away from the editor or click save button in the bottom right. 
                The overlay button will close and autosave will begin in 30s or you may choose to manually save by clicking the save button in the bottom right tool panel.
            </li>
        </ul>
        <span className={classes.listEnd} />

        <Typography variant='h6' component='h6'>4. Publish the portfolio</Typography>
        <ul className={classes.list}>
            <li>
                In the Portfolio page, click on the publish button in the bottom right panel. 
                You will be asked to input the name of the Github repository you wish to push your portfolio files to. 
            </li>
            <img src={publish} alt="publish example" className={classes.image}/>
            <li>By default, the Github repository chosen will be your Github pages root repository. To choose the default again, click on Set Default button.</li>
            <li>Click on the finalize button and the publish operation will begin.</li>
            <li>If you have chosen a name matching the name of a Github repository that you already have, publish operation will not start and an overwrite dialog will show.</li>
            <img src={publish2} alt="publish override example" className={classes.image}/>
            <li>
                If you do not wish to overwrite the contents of your Github repository, click on the cancel button to cancel the publish operation. 
                Otherwise, click on the allow overwrite button and the publish operation will begin.
            </li>
        </ul>
        <span className={classes.listEnd} />

        <Divider orientation="horizontal" className={classes.divider} />

        <span className={classes.bottomSpace} />
      </div>
    )
  }
}

export default Gettingstarted;