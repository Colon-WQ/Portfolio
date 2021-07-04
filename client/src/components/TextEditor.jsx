import React, { useEffect, useMemo, useState } from 'react'
import { Slate, Editable, withReact } from 'slate-react';
import { createEditor, Node } from 'slate';
import Toolbar from '@material-ui/core/Toolbar';
import { FaBold, FaItalic, FaUnderline, FaQuoteRight, FaListUl, FaListOl } from 'react-icons/fa';
import { withStyles } from '@material-ui/styles';

const styles = theme => ({
    toolbar: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'start',
        alignItems: 'center',
        height: 'auto'
    },
    toolbarButton: {
        marginRight: '0.5rem'
    }
})

function TextEditor(props) {

    const editor = useMemo(() => withReact(createEditor()), []);

    const { classes } = props;

    const serialize = value => {
        return (
            value.map(n => Node.string(n)).join('\n')
        );
    }

    const deserialize = string => {
        return string.split('\n').map(line => {
            return {
              children: [{ text: line }],
            }
        });
    }
    console.log(props)
    return (
        
        <Slate
            editor={editor}
            value={deserialize(props.item)}
            onChange={newValue => {
                
                const target = {
                    name: props.name,
                    value: serialize(newValue)
                }

                const temp = {
                    target: target
                }
                props.handleChange(temp, props.category);
            }}
        >
            <Toolbar className={classes.toolbar}>
                <FaBold className={classes.toolbarButton}/>
                <FaItalic className={classes.toolbarButton}/>
                <FaUnderline className={classes.toolbarButton}/>
                <FaQuoteRight className={classes.toolbarButton}/>
                <FaListUl className={classes.toolbarButton}/>
                <FaListOl className={classes.toolbarButton}/>
            </Toolbar>
            <Editable
                
                placeholder="Type here"
                onKeyDown={event => {
                    console.log(event.key)
                    if (event.key === '&') {
                        // Prevent the ampersand character from being inserted.
                        event.preventDefault()
                        // Execute the `insertText` method when the event occurs.
                        editor.insertText('and')
                    }


                }}
            />
        </Slate>
    )
}

export default withStyles(styles)(TextEditor);

