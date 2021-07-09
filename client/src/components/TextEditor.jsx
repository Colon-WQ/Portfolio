import React, { Component } from 'react';
import { Editor } from 'react-draft-wysiwyg';
import '../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { withStyles } from '@material-ui/styles';
import { EditorState, convertFromRaw, convertToRaw } from 'draft-js';

const styles = theme => ({
  textBlock: {
    borderStyle: "solid",
    borderColor: "whitesmoke",
    borderWidth: "thin"
  },
})

class TextEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hideToolbar: true,
      editorState: EditorState.createEmpty()
    }
    this.setHideToolbar = this.setHideToolbar.bind(this);
    this.setEditorState = this.setEditorState.bind(this);
  }

  componentDidMount() {
    this.setState({
      editorState: EditorState.createWithContent(convertFromRaw(this.props.item))
    })
  }

  setHideToolbar(bool) {
    this.setState({
      hideToolbar: bool
    });
  }

  setEditorState(editorState) {
    this.setState({
      editorState: editorState
    });
  }

  render() {
    const { classes } = this.props;

    return (
      <Editor
        editorClassName={classes.textBlock}
        toolbarHidden={this.state.hideToolbar}
        editorState={this.state.editorState}
        onFocus={() => {
          this.setHideToolbar(false);
        }}
        onBlur={() => {
          this.setHideToolbar(true);
          this.props.onClose(convertToRaw(this.state.editorState.getCurrentContent()));
        }}
        onEditorStateChange={newEditorState => {
          this.setEditorState(newEditorState);
        }}
      />
    )
  }


}

export default withStyles(styles)(TextEditor);