import React, { Component } from 'react';
import { withStyles } from '@material-ui/styles';
import { withRouter } from 'react-router-dom';
import * as pages from './pages';



const styles = theme => ({
})

class TutorialPages extends Component {
  render() {

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

export default withRouter(withStyles(styles)(TutorialPages));