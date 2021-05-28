import React, {Component} from 'react'
import {connect} from 'react-redux'
import {repopulate_state} from '../actions/LoginAction'
import {withStyles} from '@material-ui/core/styles'
import {Button, Fab, IconButton, TextField, Typography} from '@material-ui/core';
import {FaEdit} from "react-icons/fa";
import {Base64} from 'js-base64';
import ReactDOMServer from 'react-dom/server';
import {ServerStyleSheets, ThemeProvider} from '@material-ui/core/styles'
import EntryEditor from './EntryEditor';
import {templates} from './EntryGenerator';


/**
 * @file Portfolio component representing a user created portfolio page
 * 
 * @author Chuan Hao
 * 
 * @see Portfolio
 */

const styles = (theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'start',
        alignItems: 'center',
        paddingTop: '7%'
    },
    fab: {
        position: 'absolute',
        marginTop: '5%',
        marginLeft: '5%'
    }
})

const templateGenerators = {
    // TYPE: [style1, style2, ...], style == (dict) => <Component/>
    ENTRY: [],
    ABOUT: [],
    TIMELINE: []
}

/**
 * The portfolio component used for rendering previews and compiling for publishing.
 * 
 * @component
 */
class Portfolio extends Component {
    /**
     * @constructor
     */
    constructor(props) {
        super(props);
        this.state = {
            editMode: false,
            entries: [],
            editMode: true,
            currentEntry: 0,
            maxEntry: 0,
            showEditor: false
        }
        this.createEntry = this.createEntry.bind(this);
        this.handleEditorClose = this.handleEditorClose.bind(this);
    }

    renderEntry(entryFields, index) {
        return templates[entryFields.type][entryFields.style].component(entryFields, index);
    }

    createEntry() {
        // TODO: Add logic for a template chooser
        const entryType = "introduction";
        const entryStyle = 0;
        const newEntry = {
            type: entryType,
            style: entryStyle,
            ...templates[entryType][entryStyle].defaultField
        };
        this.setState({
            entries:  [...this.state.entries, newEntry]
        })
    }

    handleEditorClose(fields, changed) {
        if(changed) {
            // Make copy of entries
            const entries = [...this.state.entries];
            entries[this.state.currentEntry] = fields;
            this.setState({
                showEditor: !this.state.showEditor,
                entries: entries
            })
        } else {
            this.setState({
                showEditor: !this.state.showEditor
            })
        }
    }

    // TODO: publish component check file empty before load?
    handleCreateFiles() {
        const sheets = new ServerStyleSheets();
        const component = (
            <div style={{display: "flex", flexDirection: "column"}}>
                {this.state.entries.map((entry, index) => this.renderEntry(entry))}
            </div>);
        // TODO: test renderToStaticMarkup
        const rawHTML = ReactDOMServer.renderToString(sheets.collect({component}),);
        // TODO: add title
        const html = Base64.encode(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <meta http-equiv="X-UA-Compatible" content="ie=edge">
                <link href="styles.css" rel="stylesheet">
                <script defer src="script.js"/>
                <title>Welcome</title>
            </head>
            <body>
            ${rawHTML}
            </body>`);
        const css = Base64.encode(sheets.toString());
        const js = Base64.encode(this.state.entries
            .map((entry, index) => templates[entry.type][entry.style].script(index))
            .filter(Boolean).join('\n'));

        const files = [
            {
                name: 'scripts.js',
                contents: js
            },
            {
                name: 'index.html',
                contents: html
            },
            {
                name: 'styles.css',
                contents: css
            }
        ]
        return files;
    }

    render() {
        const {classes} = this.props;
        let entry = undefined;
        if (this.state.entries != []) {
            entry = this.state.entries[this.state.currentEntry];
        }

        return (
            // TODO: remove marginTop for production
        <div style={{display: "flex", flexDirection: "column"}}>
            {this.state.entries.map((entry, index) => {
                if (this.state.editMode) {
                    return (<div style={{display: "flex", flexDirection: "row"}}>
                        <Fab 
                            className={classes.fab}
                            onClick={() => this.setState({currentEntry: index, showEditor: !this.state.showEditor})}>
                            <FaEdit/>
                        </Fab>
                        {this.renderEntry(entry)}
                    </div>);
                }
                return (this.renderEntry(entry));
            })}
            {this.state.editMode && this.state.showEditor && entry != undefined
                ? <EntryEditor fields={entry} info={templates[entry.type][entry.style].info} onClose={this.handleEditorClose} /> 
                : null}
            {this.state.editMode ? <Button onClick={this.createEntry}> Add an entry </Button> : null}
        </div>);
    }
}

/**
 * Function that maps variables from Redux Store to Home component's props.
 *
 * @param {Object} state - Redux Store
 * @memberof EntryEditor
 */
const mapStateToProps = state => ({
    loggedIn: state.login.loggedIn,
    name: state.login.name
})

/** 
 * Provides action creators to Home component's props.
 * 
 * @type {Object.<Function>} 
 * @memberof EntryEditor
 */
const mapDispatchToProps = {
    repopulate_state
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Portfolio))