import React, { Component } from 'react';
import { withStyles } from '@material-ui/styles';
import * as pages from './pages';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { FaDotCircle } from 'react-icons/fa';
import TutorialPages from './TutorialPages';

const drawerWidth = '25vh';

const styles = theme => ({
  root: {
    display: 'flex',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
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
    width: `calc(100% - ${drawerWidth}vh)`,
    height: 'auto',
    marginLeft: drawerWidth,
  },
  appBarSpacer: theme.mixins.toolbar,
})

class Tutorial extends Component {
  render() {
    const { classes } = this.props;

    return (
      <div>
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
            {Object.keys(pages).map((key) => {
              var topic = key;
              switch (key) {
                case "guestdeploy":
                  topic = "Guest Deploy"
                  break;
                default:
                  topic = topic[0].toUpperCase() + topic.substring(1);
                  break;
              }
              return (
                <ListItem className={classes.listItem} button key={topic} onClick={() => this.props.history.push(`/tutorial/${key}`)}>
                  <ListItemIcon className={classes.listIcon}>{<FaDotCircle />}</ListItemIcon>
                  <ListItemText primary={topic} />
                </ListItem>)
              }
            )}
          </List>
          <Divider />
        </Drawer>
        <div className={classes.contentArea}>
          <TutorialPages/>
        </div>
      </div>
    )
  }

}

export default withStyles(styles)(Tutorial);
