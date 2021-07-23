import React, { Component } from 'react';
import { withStyles } from '@material-ui/styles';
import SupportPages from './SupportPages';
import * as pages from './pages';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { FaDotCircle } from 'react-icons/fa';

const drawerWidth = '25vh'

const styles = theme => ({
  root: {
    display: 'flex',
  },
  drawer: {
    width: drawerWidth,
    minWidth: '250px',
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
    minWidth: '250px',
    padding: '10px'
  },
  listItem: {
    padding: 0
  },
  listIcon: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },
  contentArea: {
    width: `calc(100% - max(${drawerWidth}, 250px))`,
    height: 'auto',
    padding: '10px'
  },
  appBarSpacer: theme.mixins.toolbar,
})

class Support extends Component {
  render() {
    const { classes } = this.props;

    return (
      <div
        style={{
          display: 'flex'
        }}
      >
        <CssBaseline />
        <Drawer
          className={classes.drawer}
          variant="permanent"
          classes={{
            paper: classes.drawerPaper,
          }}
          anchor="left"
        >
          <div className={classes.appBarSpacer} />
          <Divider />
          <List>
            {Object.entries(pages).map(([key, value]) => {
              var topic = value.topic;

              return (<ListItem className={classes.listItem} button key={topic} onClick={() => this.props.history.push(`/support/${key}`)}>
                <ListItemIcon className={classes.listIcon}>{<FaDotCircle />}</ListItemIcon>
                <ListItemText primary={topic} />
              </ListItem>)
            }
            )}
          </List>
          <Divider />
        </Drawer>
        <div className={classes.contentArea}>
          <SupportPages />
        </div>
      </div>
    )
  }
}

export default withStyles(styles)(Support);
