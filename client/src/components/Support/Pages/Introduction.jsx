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

class Introduction extends Component {
  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <Typography>sample text</Typography>
      </div>
    )
  }
}

export default withStyles(styles)(Introduction);
