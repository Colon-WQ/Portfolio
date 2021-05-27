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
    // static propTypes = {
    //     onPublish: PropTypes.func.isRequired,
    //     fields: PropTypes.shape({
    //         finalizeDialogState: Proptypes.bool,
    //         overwriteDialogState: Proptypes.bool,
    //         entryDisplayIndex: Proptypes.number,
    //         repositoryName: Proptypes.string
    //     })
    // };

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

    //handle all case of OnChange
    handleOnChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    // handle any form of state boolean changes.
    // Note: Store it under separate custom attribute. id shld be saved for reference purposes and must be unique.
    // Warning: eact does not recognize the `componentName` prop on a DOM element. 
    // If you intentionally want it to appear in the DOM as a custom attribute, spell it as lowercase `componentname` instead.
    // custom attributes must be lowercase.
    handleStateChange(event) {
        const customAttribute = event.currentTarget.getAttribute('componentname')
        console.log(customAttribute)
        console.log(this.state[customAttribute])
        this.setState({
            [customAttribute]: !this.state[customAttribute]
        })
    }

    //Dialog Open & Close handler functions are necessary because MUI Dialog requires it.
    //Also needs to close menu after selection.
    handleFinalizeDialogOpen() {
        this.setState({
            anchorEl: null,
            finalizeDialogState: true
        })
    }

    //Dialog API requires an onClose() possibly closure by other means other than clicking cancel.
    handleFinalizeDialogClose() {
        this.setState({
            finalizeDialogState: false
        })
    }

    //Dialog Open & Close handler functions are necessary because MUI Dialog requires it.
    handleOverrideDialogOpen() {
        this.setState({
            overrideDialogState: true
        })
    }

    //Dialog API requires an onClose() possibly closure by other means other than clicking cancel.
    handleOverrideDialogClose() {
        this.setState({
            overrideDialogState: false
        })
    }

    //handle any form of anchoring menu to FAB
    handleAnchorMenu(event) {
        const anchorEl = event.currentTarget.getAttribute("componentname")
        console.log(anchorEl)
        this.setState({
            [anchorEl]: event.currentTarget
        })
    }

    //handles any form of deAnchoring menu from FAB
    handleReleaseMenu(event) {
        const anchorEl = event.currentTarget.getAttribute("componentname");
        console.log(anchorEl)
        this.setState({
            [anchorEl]: null
        })
    }

    //TODO push to exisiting repo testing in progress
    //routes set to nothing for now
    //hardcoded name for now
    //console.log is run but nothing happens. route is correct
    async handleOverrideAllowed() {
        console.log("Override permission given to push to " + "testShit")
        await axios({
            method: "PUT",
            url: process.env.REACT_APP_BACKEND + "/portfolio/pushToGithub",
            withCredentials: true,
            data: {
                routes: "",
                content: "content",
                repo: "testShit"
            }
        }).then(res => {
            console.log(res)
        }).catch(err => {
            console.log(err)
        })

        this.setState({
            overrideDialogState: false,
            repositoryName: ''
        })
    }

    async handlePushToGithub() {
        await axios({
            method: "PUT",
            url: process.env.REACT_APP_BACKEND + "/portfolio/pushToGithub",
            withCredentials: true,
            data: {
                routes: "",
                content: "content",
                repo: this.state.repositoryName
            }
        }).then(res => {
            console.log(res)
        }).catch(err => {
            console.log(err)
        })
    }

    //checks for existing repo by name and creates new repo if no existing. Otherwise prompts user for override.
    async handleFinalizeEdits() {
        console.log("chosen repository name is " + this.state.repositoryName)
        await axios({
            method: "GET",
            url: process.env.REACT_APP_BACKEND + "/portfolio/checkExistingRepos",
            withCredentials: true,
            params: {
                repo: this.state.repositoryName
            }
        }).then(async res => {
            console.log(res.data.message)
            await axios({
                method: "POST",
                url: process.env.REACT_APP_BACKEND + "/portfolio/createRepo",
                withCredentials: true,
                data: {
                    repo: this.state.repositoryName
                }
            }).then(response => {
                console.log(response.data.message)
            }).catch(err => {
                console.log(err.message)
                console.log("repository creation failed")
            })
        }).catch(err => {
            console.log(err.response.data)
            this.setState({
                overrideDialogState: true
            })
        })

        this.setState({
            finalizeDialogState: false,
            repositoryName: ''
        })
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