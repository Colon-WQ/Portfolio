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

class Entryeditor extends Component {
  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <span className={classes.topSpace}/>

        <Typography variant='h2' component='h2'>Entry Editor</Typography>
        <Divider orientation="horizontal" className={classes.divider}/>

        <Typography variant='h5' component='h5'>Accessing the Entry Editor</Typography>
        <Divider orientation="horizontal" className={classes.divider}/>
        <ul className={classes.paragraph}>
            <li>To access the Entry Editor, there must be an existing entry.</li>
            <li>The Entry Editor is by default hidden from view.</li>
            <li>Hover your cursor over an entry to reveal a Settings button</li>
            <li>Click on the Settings button, then click on the Edit Entry button to open the Entry Editor for the entry</li>
        </ul>
        <Divider orientation="horizontal" className={classes.divider}/>

        <span className={classes.bottomSpace}/>
      </div>
    )
  }
}

export default withStyles(styles)(Entryeditor);