import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import { withStyles } from '@material-ui/styles';
import { Typography } from '@material-ui/core';

const styles = theme => ({
  dialog: {
    position: 'fixed',
    padding: '1%',
  },
  subDialog: {
    width: '80%',
    height: 'max-content',
    margin: 'auto',
  },
  dialogButton: {
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
      dialogState: false
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
      dialogState: !this.state.dialogState,
      displayText: save ? this.state.text : this.state.displayText
    })
  }

  render() {
    const { classes, label, name } = this.props;

    return (
      <div>
        <Button
          className={classes.dialogButton}
          onClick={() => this.handleClose(true)}
        >
          <Typography noWrap>
            {this.state.displayText}
          </Typography>
        </Button>
        <Dialog
          maxWidth="xl"
          fullScreen
          className={`${classes.dialog} ${classes.subDialog}`}
          open={this.state.dialogState}
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
        </Dialog>

      </div>
    )
  }

}

export default withStyles(styles)(SimpleTextEditor);
