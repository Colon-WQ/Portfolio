import React, { Component } from 'react';
import { withStyles } from '@material-ui/styles';
import { withRouter } from 'react-router-dom';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { FaDotCircle } from 'react-icons/fa';

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
