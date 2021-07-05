import React, { useEffect, useMemo, useState, useCallback } from 'react'
import { Slate, Editable, withReact } from 'slate-react';
import { createEditor, Node, Transforms, Editor, Text } from 'slate';
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

const DefaultElement = props => {
    return <p {...props.attributes}>{props.children}</p>
}

const CodeElement = props => {
    return (
        <pre {...props.attributes}>
            <code>{props.children}</code>
        </pre>
    )
}

const Leaf = props => {
    return (
        <span
            {...props.attributes}
            style={{ fontWeight: props.leaf.bold ? 'bold' : 'normal' }}
        >
            {props.children}
        </span>
    )
}

// Define our own custom set of helpers.
const CustomEditor = {
    isBoldMarkActive(editor) {
        const [match] = Editor.nodes(editor, {
            match: n => n.bold === true,
            universal: true,
        })

        return !!match
    },

    isCodeBlockActive(editor) {
        const [match] = Editor.nodes(editor, {
            match: n => n.type === 'code',
        })

        return !!match
    },

    toggleBoldMark(editor) {
        const isActive = CustomEditor.isBoldMarkActive(editor)
        Transforms.setNodes(
            editor,
            { bold: isActive ? null : true },
            { match: n => Text.isText(n), split: true }
        )
    },

    toggleCodeBlock(editor) {
        const isActive = CustomEditor.isCodeBlockActive(editor)
        Transforms.setNodes(
            editor,
            { type: isActive ? null : 'code' },
            { match: n => Editor.isBlock(editor, n) }
        )
    },
}

const TextEditorSlate = props => {

    const editor = useMemo(() => withReact(createEditor()), []);

    const { classes } = props;


    const renderElement = useCallback(props => {
        switch (props.element.type) {
            case 'code':
                return <CodeElement {...props} />
            default:
                return <DefaultElement {...props} />
        }
    }, []);

    const renderLeaf = useCallback(props => {
        return <Leaf {...props} />
    }, [])

    return (

        <Slate
            editor={editor}
            value={props.item}
            onChange={newValue => {

                const target = {
                    name: props.name,
                    value: newValue
                }

                const temp = {
                    target: target
                }
                props.handleChange(temp, props.category);
            }}
        >
            <Toolbar className={classes.toolbar}>
                <FaBold className={classes.toolbarButton} onMouseDown={event => {
                    event.preventDefault();
                    CustomEditor.toggleBoldMark(editor);
                }}/>
                <FaItalic className={classes.toolbarButton} />
                <FaUnderline className={classes.toolbarButton} />
                <FaQuoteRight className={classes.toolbarButton} />
                <FaListUl className={classes.toolbarButton} />
                <FaListOl className={classes.toolbarButton} />
            </Toolbar>
            <Editable
                renderElement={renderElement}
                renderLeaf={renderLeaf}
                placeholder="Type here"
                onKeyDown={event => {
                    if (!event.ctrlKey) {
                        return
                    }

                    // Replace the `onKeyDown` logic with our new commands.
                    switch (event.key) {
                        case '`': {
                            event.preventDefault()
                            CustomEditor.toggleCodeBlock(editor)
                            break
                        }

                        case 'b': {
                            event.preventDefault()
                            CustomEditor.toggleBoldMark(editor)
                            break
                        }
                    }
                }}
            />
        </Slate>
    )
}

export default withStyles(styles)(TextEditorSlate);

