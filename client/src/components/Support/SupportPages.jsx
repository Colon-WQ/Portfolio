import React, { Component } from 'react';
import { withStyles } from '@material-ui/styles';
import { withRouter } from 'react-router-dom';

import * as pages from './pages';

const styles = theme => ({
  root: {
    backgroundColour: '#f00'
  }
})

class SupportPages extends Component {
  render() {
    const { classes } = this.props;

    const Contents = pages[this.props.match.params.id.toLowerCase()];
    return (
      <Contents classes={classes} />
    )
  }
}

export default withRouter(withStyles(styles)(SupportPages));
