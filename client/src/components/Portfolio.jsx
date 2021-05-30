import React, {Component} from 'react'
import {connect} from 'react-redux'
import {repopulate_state} from '../actions/LoginAction'
import {withStyles} from '@material-ui/core/styles'
import {Button, Fab, IconButton, TextField, Typography} from '@material-ui/core';
import {FaEdit, FaPlus, FaSave} from "react-icons/fa";
import {Base64} from 'js-base64';
import ReactDOMServer from 'react-dom/server';
import {ServerStyleSheets, ThemeProvider} from '@material-ui/core/styles'
import EntryEditor from './EntryEditor';
import {templates} from './EntryGenerator';
import TemplateSelector from './TemplateSelector';


/**
 * @file Portfolio component representing a user created portfolio
 * 
 * @author Chuan Hao
 * 
 * @see Portfolio
 */

/**
 * Style generator to dynamically adjust styles based on theme provided
 * 
 * @memberof Portfolio
 * @param {Object} theme 
 */
const styles = (theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'start',
        alignItems: 'center',
        paddingTop: '7%',
    },
    entryDiv: {
        position: 'relative'
    },
    editFAB: {
        position: 'absolute',
        marginTop: '2vw',
        marginLeft: '2vw'
    },
    controlFAB: {
        position: 'static',
        marginRight: '0.5vw',
        marginBottom: '0.5vw'
    },
    staticDiv: {
        position: 'fixed',
        bottom: 0,
        right: 0
    }
})

/**
 * The portfolio component used for rendering previews and compiling for publishing.
 * 
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
            editMode: true,
            pages: [{
                directory: "",
                entries: [],
            }],
            currentPage: 0,
            currentEntry: 0,
            showEditor: false,
            showSelector: false
        }
        this.handleEditorClose = this.handleEditorClose.bind(this);
        this.handleCreateFile = this.handleCreateFile.bind(this);
        this.handleProduction = this.handleProduction.bind(this);
        this.handleSelector = this.handleSelector.bind(this);
    }

    /**
     * Function to enter entries based on the entry's type and template style.
     * 
     * @param {*} entryFields 
     * @param {number} index 
     * @returns void
     * @memberof Portfolio
     */
    renderEntry(entryFields, index) {
        return templates[entryFields.type][entryFields.style].component(entryFields, index);
    }

    /**
     * Event handler to open/close the template selector and update states if necessary
     * 
     * @param {*} selection - the fields to update, or null if no changes are needed
     */
    handleSelector(selection) {
        if(selection === null) {
            this.setState({
                showSelector: !this.state.showSelector
            })
        } else {
            const entryType = selection.type;
            const entryStyle = selection.style;
            const fieldsCopy = JSON.parse(JSON.stringify(templates[entryType][entryStyle].defaultField))
            const newEntry = {
                type: entryType,
                style: entryStyle,
                ...fieldsCopy
            };
            const newPages = [...this.state.pages];
            newPages[this.state.currentPage].entries = 
                [...this.state.pages[this.state.currentPage].entries, newEntry];
            this.setState({
                pages: newPages,
                showSelector: !this.state.showSelector
            })
        }
    }

    /**
     * Function to update the entry based on the styles provided by the user.
     * 
     * @param {*} fields
     * @param {boolean} changed - Whether the fields have been changed/ if the user intends to save the changes.
     */
    handleEditorClose(fields, changed) {
        if(changed) {
            const newPages = [...this.state.pages];
            const entries = [...this.state.pages[this.state.currentPage].entries];
            entries[this.state.currentEntry] = fields;
            newPages[this.state.currentPage].entries = entries;
            this.setState({
                showEditor: !this.state.showEditor,
                pages: newPages
            })
        } else {
            this.setState({
                showEditor: !this.state.showEditor
            })
        }
    }

    // TODO: publish component check file empty before load?
    /**
     * A function to generate the necessary html/css/js files for a single page.
     * 
     * @param {*} entries 
     * @param {string} directory - The directory/route to the page as defined by the user.
     * @returns {(Map|Array)} An array of maps containing the relative paths to each file and their contents.
     * 
     */
    handleCreateFile(entries, directory) {
        console.log(entries);
        const sheets = new ServerStyleSheets();
        // TODO: test renderToStaticMarkup
        const rawHTML = ReactDOMServer.renderToString(sheets.collect(
            <div style={{display: "flex", flexDirection: "column"}}>
                {entries.map((entry, index) => this.renderEntry(entry))}
            </div>),);
        // TODO: add title
        const html = Base64.encode(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <meta http-equiv="X-UA-Compatible" content="ie=edge">
                <link href="styles.css" rel="stylesheet">
                <script defer src="script.js"></script>
                <title>Welcome</title>
            </head>
            <body>
            ${rawHTML}
            </body>`);
        const css = Base64.encode(sheets.toString());
        const js = Base64.encode(entries
            .map((entry, index) => templates[entry.type][entry.style].script(index))
            .filter(Boolean).join('\n'));

        const files = [
            {
                file: `${directory}scripts.js`,
                contents: js
            },
            {
                file: `${directory}index.html`,
                contents: html
            },
            {
                file: `${directory}styles.css`,
                contents: css
            }
        ]
        return files;
    }

    /**
     * A function to generate all files needed to be pushed to github.
     * @returns {(Map|Array)} An array of maps each containing the relative paths to each file and their contents.
     */
    handleProduction() {
        let index = 0;
        const resArray = [];
        for (const page of this.state.pages) {
            const fileArray = this.handleCreateFile(page.entries, page.directory);
            console.log(fileArray);
            resArray[index] = fileArray[0];
            resArray[index + 1] = fileArray[1];
            resArray[index + 2] = fileArray[2];
            index += 3;
        }
        return resArray;
    }

    render() {
        const {classes} = this.props;
        let entry = undefined;
        if (this.state.pages[this.state.currentPage].entries != []) {
            entry = this.state.pages[this.state.currentPage].entries[this.state.currentEntry];
        }

        return (
        <div style={{display: "flex", flexDirection: "column"}}>
            {this.state.pages[this.state.currentPage].entries.map((entry, index) => {
                return (<div style={{display: "flex", flexDirection: "row"}}>
                    <Fab 
                        className={classes.editFAB}
                        onClick={() => this.setState({currentEntry: index, showEditor: !this.state.showEditor})}>
                        <FaEdit/>
                    </Fab>
                    {this.renderEntry(entry)}
                </div>);
            })}
            {this.state.showEditor && entry != undefined
                ? <EntryEditor 
                    fields={entry} 
                    info={templates[entry.type][entry.style].info} 
                    onClose={this.handleEditorClose} 
                /> 
                : null}
            {this.state.showSelector
                ? <TemplateSelector
                    onClose={this.handleSelector} 
                /> 
                : null}
            <div className={classes.staticDiv}>
                <Fab 
                    className={classes.controlFAB}
                    onClick={() => this.handleSelector(null)}>
                    <FaPlus/>
                </Fab>
                <Fab 
                    className={classes.controlFAB}
                    onClick={() => console.log(this.handleProduction())}>
                    <FaSave/>
                </Fab>
            </div>
        </div>);
    }
}

/**
 * Function that maps variables from Redux Store to Home component's props.
 *
 * @param {Object} state - Redux Store
 * @memberof Portfolio
 */
const mapStateToProps = state => ({
    loggedIn: state.login.loggedIn,
    name: state.login.name
})

/** 
 * Provides action creators to Home component's props.
 * 
 * @type {Object.<Function>} 
 * @memberof Portfolio
 */
const mapDispatchToProps = {
    repopulate_state
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Portfolio))