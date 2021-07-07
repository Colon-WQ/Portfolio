import React, { useState } from 'react';
import { Editor } from 'react-draft-wysiwyg';
import '../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { withStyles } from '@material-ui/styles';

const styles = theme => ({
    textBlock: {
        borderStyle: "solid",
        borderColor: "whitesmoke",
        borderWidth: "thin"
    },
    
})

const TextEditor = props => {

    const [hideToolbar, setHideToolbar] = useState(true);

    const { classes } = props;
    
    return (
        <Editor
            
            editorClassName={classes.textBlock}
            
            toolbarHidden={hideToolbar}
            initialContentState={props.item}
            onFocus={() => {
                setHideToolbar(false);
            }}
            onBlur={() => {
                setHideToolbar(true);
            }}
            onContentStateChange={newContentState => {
                // console.log(newContentState.blocks)
                // console.log(newContentState.entityMap)
                const target = {
                    name: props.name,
                    value: newContentState
                };
                const temp = {
                    target: target
                };
                props.handleChange(temp, props.category, props.section);
            }}
        />
    )
    
}

export default withStyles(styles)(TextEditor);