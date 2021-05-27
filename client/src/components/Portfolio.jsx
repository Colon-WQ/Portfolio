import React, { Component } from 'react'
import { connect } from 'react-redux'
import { repopulate_state } from '../actions/LoginAction'
import axios from 'axios'
import { withStyles } from '@material-ui/core/styles'
import { Button, Fab, IconButton, TextField, Typography } from '@material-ui/core';
import { FaEdit } from "react-icons/fa";
import { Base64 } from 'js-base64';
import PropTypes from 'prop-types';
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

/**
 * The portfolio component used for rendering previews and compiling for publishing.
 * 
 * @component
 */
class Portfolio extends Component {
    /**
     * @constructor
     */
    constructor() {
        super();
        this.state = {
            entries: [],
            editMode: true,
            currentEntry: 0,
            maxEntry: 0,
            showEditor: false
        }
        this.createEntry = this.createEntry.bind(this);
        this.handleEditorClose = this.handleEditorClose.bind(this);
    }

    renderElement(entryFields) {
        return templates[entryFields.type][entryFields.style].component(entryFields);
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

    render() {
        const {classes} = this.props;
        let entry = undefined;
        if (this.state.entries != []) {
            entry = this.state.entries[this.state.currentEntry];
        }

        return (
        <div style={{display: "flex", flexDirection: "column", marginTop: "100px"}}>
                {this.state.entries.map((entry, index) => {
                    if (this.state.editMode) {
                        return (<div style={{display: "flex", flexDirection: "row"}}>
                            <Fab 
                                className={classes.fab}
                                onClick={() => this.setState({currentEntry: index, showEditor: !this.state.showEditor})}>
                                <FaEdit/>
                            </Fab>
                            {this.renderElement(entry)}
                        </div>);
                    }
                    return (this.renderElement(entry));
                })}
                {this.state.editMode && this.state.showEditor && entry != undefined
                    ? <EntryEditor 
                        fields={entry} 
                        info={templates[entry.type][entry.style].info}
                        onClose={this.handleEditorClose}
                    /> 
                    : null}
            <Button onClick={this.createEntry}> Add an entry </Button>
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