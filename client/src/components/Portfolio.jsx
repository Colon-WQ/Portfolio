import React, { Component } from 'react'
import { connect } from 'react-redux'
import { repopulate_state } from '../actions/LoginAction'
import axios from 'axios'
import { withStyles } from '@material-ui/core/styles'
import { Button, IconButton, TextField, Typography } from '@material-ui/core';
import { GrFormClose } from "react-icons/gr";
import { Base64 } from 'js-base64';
import PropTypes from 'prop-types';
import EntryEditor from './EntryEditor'

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
            currentEntry: {},
            showEditor: false
        }
    }

    renderElement(entry) {
        return templateGenerators[entry.type][entry.style](entry);
    }

    render() {
        const {classes} = this.props;

        return (<div>
            {this.state.editMode ? <EntryEditor fields={this.state.currentEntry}/> : null}
            {this.state.entries.map((entry, index) => {
                if (this.state.editMode) {
                    return (<div>
                        <IconButton onClick={() => this.setState({currentEntry: entries[index], showEditor: !this.state.showEditor})}>Edit</IconButton>
                        {this.renderElement(entry)}
                    </div>);
                }
                return (this.renderElement(entry));
            })}
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