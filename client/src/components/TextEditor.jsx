import React, { Component } from 'react';
import { Editor } from 'react-draft-wysiwyg';
import '../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { withStyles } from '@material-ui/styles';
import { EditorState, convertFromRaw, convertToRaw } from 'draft-js';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';

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
    width: '100%'
  },
  modal: {
    position: 'fixed',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'start',
    padding: '1%',
  },
  subModal: {
    width: '80%',
    height: '80%',
    margin: 'auto',
    backgroundColor: theme.palette.primary.main
  },
  modalButton: {
    marginTop: '1%',
    marginBottom: '1%'
  },
  finalizeButton: {
    height: '5%',
    width: '10%',
    marginLeft: "90%",
    marginRight: "0%",
    marginTop: '1.5%',
    backgroundColor: 'white',
    '&:hover': {
      backgroundColor: 'green',
      color: 'white'
    }
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
    this.toggleModalState = this.toggleModalState.bind(this);
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

  toggleModalState(bool) {
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
          onClick={() => this.toggleModalState(true)}
          variant="outlined"
        >
          {`Edit ${label}`}
        </Button>
        <Modal
          className={`${classes.modal} ${classes.subModal}`}
          open={this.state.modalState}
          onClose={() => {
            this.props.onClose(convertToRaw(this.state.editorState.getCurrentContent()));
            this.toggleModalState(false);
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
                onEditorStateChange={newEditorState => {
                  this.setEditorState(newEditorState);
                }}
              />
            </div>
            <Button
              className={classes.finalizeButton}
              onClick={() => {
                this.props.onClose(convertToRaw(this.state.editorState.getCurrentContent()));
                this.toggleModalState(false);
              }}
              variant='outlined'
            >
              Finalize
            </Button>
          </div>
        </Modal>
      
      </div>
    )
  }


}

export default withStyles(styles)(TextEditor);