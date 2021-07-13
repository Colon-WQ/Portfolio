import React, { Component } from 'react';
import { withStyles } from '@material-ui/styles';
import { withRouter } from 'react-router-dom';

import * as pages from './pages';

const styles = theme => ({
})

class SupportPages extends Component {
  render() {
    const { classes } = this.props;

    const Contents = pages[this.props.match.params.id.toLowerCase()];
    return (
      <Contents />
    )
  }
}

export default withRouter(withStyles(styles)(SupportPages));
