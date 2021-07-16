import React, { Component } from 'react';
import { Editor } from 'react-draft-wysiwyg';
import '../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { withStyles } from '@material-ui/styles';
import { EditorState, convertFromRaw, convertToRaw } from 'draft-js';
import { fonts } from '../../styles/fonts';
import { Button, Fab, Dialog, Typography } from '@material-ui/core';
import { FaSave } from 'react-icons/fa';

const styles = theme => ({
  editor: {
    height: "auto",
    width: "100%",
  },
  editorDiv: {
    height: '92.5%',
    width: '100%'
  },
  textArea: {
    borderStyle: "solid",
    borderColor: "whitesmoke",
    borderWidth: "thin",
    backgroundColor: "white",
    height: 'auto',
    width: 'auto',
    maxHeight: '60vh',
    overflowY: 'auto',
    overflowX: 'hidden'
  },
  toolBar: {
    height: 'auto',
    width: "auto"
  },
  modalDiv: {
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    padding: '10px'
  },
  modal: {
    position: 'fixed',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'start',
    padding: '1%',
  },
  subDialog: {
    width: '80%',
    height: '80%',
    margin: 'auto',
    backgroundColor: theme.palette.background.default
  },
  modalButton: {
    marginTop: '1%',
    marginBottom: '1%',
    width: '10vw',
    minWidth: '100px',
  },
  finalizeButton: {
    marginLeft: 'auto',
  }
})

class TextEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty(),
      modalState: false
    }
    // this.setHideToolbar = this.setHideToolbar.bind(this);
    this.setEditorState = this.setEditorState.bind(this);
    this.toggleDialogState = this.toggleDialogState.bind(this);
  }

  componentDidMount() {
    this.setState({
      editorState: EditorState.createWithContent(convertFromRaw(this.props.item))
    })
  }

  setEditorState(editorState) {
    this.setState({
      editorState: editorState
    });
  }

  toggleDialogState(bool) {
    this.setState({
      modalState: bool
    })
  }

  render() {
    const { classes, label } = this.props;
    return (
      <div>
        <Button
          className={classes.modalButton}
          onClick={() => this.toggleDialogState(true)}
        >
          <Typography noWrap>
            {`Edit ${label}`}
          </Typography>
        </Button>
        <Dialog
          maxWidth="xl"
          fullScreen
          className={`${classes.modal} ${classes.subDialog}`}
          open={this.state.modalState}
          onClose={() => {
            this.props.onClose(convertToRaw(this.state.editorState.getCurrentContent()));
            this.toggleDialogState(false);
          }}
          aria-labelledby="complex-text-editor"
          aria-describedby="complex-text-editor"
        >
          <div className={classes.modalDiv}>
            <div className={classes.editorDiv}>
              <Editor
                wrapperClassName={classes.editor}
                editorClassName={classes.textArea}
                toolbarClassName={classes.toolBar}
                editorState={this.state.editorState}
                toolbar={{
                  fontFamily: {
                    options: fonts
                  }
                }}
                onEditorStateChange={newEditorState => {
                  this.setEditorState(newEditorState);
                }}
              />
            </div>
            <Fab
              className={classes.finalizeButton}
              variant="extended"
              onClick={() => {
                this.props.onClose(convertToRaw(this.state.editorState.getCurrentContent()));
                this.toggleDialogState(false);
              }}
              variant='outlined'
            >
              <FaSave />
              Save
            </Fab>
          </div>
        </Dialog>

      </div>
    )
  }


}

export default withStyles(styles)(TextEditor);