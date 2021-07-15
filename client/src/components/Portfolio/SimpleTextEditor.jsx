import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';
import { withStyles } from '@material-ui/styles';
import { Typography } from '@material-ui/core';

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
    marginBottom: '1%',
    width: '10vw',
    minWidth: '100px',
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

class SimpleTextEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
      displayText: '',
      modalState: false
    }
    this.setText = this.setText.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  componentDidMount() {
    this.setState({
      text: this.props.item,
      displayText: this.props.item
    })
  }

  setText(text) {
    this.setState({
      text: text
    })
  }

  handleClose(save) {
    this.setState({
      modalState: !this.state.modalState,
      displayText: save ? this.state.text : this.state.displayText
    })
  }

  render() {
    const { classes, label, name } = this.props;

    return (
      <div>
        <Button
          className={classes.modalButton}
          onClick={() => this.handleClose(true)}
        >
          <Typography noWrap>
            {this.state.displayText}
          </Typography>
        </Button>
        <Modal
          className={`${classes.modal} ${classes.subModal}`}
          open={this.state.modalState}
          onClose={() => {
            this.props.onClose(this.state.text);
            this.handleClose(true);
          }}
          aria-labelledby="simple-text-editor"
          aria-describedby="simple-text-editor"
        >
          <div className={classes.textFieldDiv}>
            <TextField
              className={classes.textArea}
              name={name}
              id={name}
              label={label}
              value={this.state.text}
              margin="normal"
              variant="outlined"
              onChange={(event) => this.setText(event.target.value)}
            />
          </div>
        </Modal>

      </div>
    )
  }

}

export default withStyles(styles)(SimpleTextEditor);
