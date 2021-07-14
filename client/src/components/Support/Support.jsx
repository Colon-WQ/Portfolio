import React, { Component } from 'react';
import { withStyles } from '@material-ui/styles';

const styles = theme => ({
})

class Support extends Component {
  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <h2>Topics</h2>
      </div>
    )
  }

}

export default withStyles(styles)(Support);
