import React, { Component } from 'react';
import { withStyles } from '@material-ui/styles';
import { withRouter } from 'react-router-dom';
import * as pages from './pages';



const styles = theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'start',
    alignItems: 'left',
  },
  title: {
    color: theme.palette.text.primary,
    marginTop: '1rem',
    marginBottom: '1rem'
  },
  header: {
    color: theme.palette.text.main,
    marginTop: '0.5rem',
    marginBottom: '0.5rem'
  },
  list: {
    paddingLeft: '1rem'
  },
  nestedList: {
    paddingLeft: '2rem'
  },
  codeDiv: {
    backgroundColor: '#00000033',
    width: '100%',
    overflow: 'auto',
    padding: '10px'
  },
  multiline: {
    whiteSpace: 'pre-line'
  },
  divider: {
    marginInline: '5px'
  }
})

class TutorialPages extends Component {
  render() {
    console.log(this.props);
    const { classes } = this.props;

    if (this.props.match.params.id === undefined) {
      return (
        <div />
      )
    } else {
      const Contents = pages[this.props.match.params.id.toLowerCase()].component;
      return (
        <Contents classes={classes} />
      )
    }
  }
}

export default withRouter(withStyles(styles)(TutorialPages));