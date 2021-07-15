import React, { Component } from 'react';
import { withStyles } from '@material-ui/styles';
import { withRouter } from 'react-router-dom';
import * as pages from './pages';



const styles = theme => ({
  appBarSpacer: theme.mixins.toolbar,
})

class SupportPages extends Component {
  render() {
    const { classes } = this.props;

    if (this.props.match.params.id === undefined) {
      return (
        <div/>
      )
    } else {
      const Contents = pages[this.props.match.params.id.toLowerCase()];
      return (
        <Contents />
      )
    }
  }
}

export default withRouter(withStyles(styles)(SupportPages));
