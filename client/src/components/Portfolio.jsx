import React, { Component } from 'react'
import { connect } from 'react-redux'
import { repopulate_state } from '../actions/LoginAction'
import axios from 'axios'
import { withStyles } from '@material-ui/core/styles'
import { Button, IconButton, TextField, Typography } from '@material-ui/core';
import { GrFormClose } from "react-icons/gr";
import { Base64 } from 'js-base64';
import PropTypes from 'prop-types';

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
    floating: {
        margin: 0,
        top: 'auto',
        left: 'auto',
        bottom: '8%',
        right: '5%',
        position: 'fixed',
        textAlign: 'center'
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
    static propTypes = {
        editMode: PropTypes.bool,
        onPublish: PropTypes.func.isRequired
    };

    /**
     * @constructor
     */
    constructor() {
        super();
        this.state = {
            entries: []
        }

    }

    /**
     * Method to generate Entry components to be populated in Portfolio
     * 
     * @property {Function} handleImageUpload
     * @param {*} event 
     * @return void
     * @memberof Portfolio
     */
    renderElement(entry) {
        return templateGenerators[entry.type][entry.style](entry);
    }

    render() {
        const {classes} = this.props;

        return (<div>
            {this.props.editMode ? <IconButton>edit icon</IconButton> : null}
            {this.state.entries.map((entry, index) => {
                return this.renderElement(entry);
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