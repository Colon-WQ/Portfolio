import React, { Component } from 'react';
import { withStyles } from '@material-ui/styles';

const styles = theme => ({
  modal: {
    position: 'fixed',
    padding: '1%',
  },
  subModal: {
    width: '80%',
    height: '10%',
    margin: 'auto',
  },
  modalButton: {
    marginTop: '1%',
    marginBottom: '1%'
  },
  textArea: {
    height: 'auto',
    width: '100%',
    backgroundColor: 'white',
    margin: 'auto'
  },
  textFieldDiv: {
    padding: '1%',
    backgroundColor: 'white'
  }
})

class Tutorial extends Component {
  render() {
    const { classes } = this.props;

    return (
      <div>
      </div>
    )
  }

}

export default withStyles(styles)(Tutorial);
