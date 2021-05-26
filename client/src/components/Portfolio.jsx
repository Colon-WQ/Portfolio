import React, { Component } from 'react'
import { connect } from 'react-redux'
import { repopulate_state } from '../actions/LoginAction'
import axios from 'axios'
import { GrFormClose } from "react-icons/gr";
import { Base64 } from 'js-base64';
import PropTypes from 'prop-types';

//MUI component imports
import Fab from '@material-ui/core/Fab';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import { FaEdit, FaCheck } from 'react-icons/fa';



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
    actionFAB: {
        margin: 0,
        top: 'auto',
        left: 'auto',
        bottom: '8%',
        right: '5%',
        position: 'fixed',
        textAlign: 'center'
    },
    modeFAB: {
        margin: 0,
        top: '10%',
        left: 'auto',
        right: 'auto',
        bottom: 'auto',
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
            ...this.props.fields,
            anchorEl: null,
            entryDisplayIndex: -1
        }
        this.handleOnChange = this.handleOnChange.bind(this);
        this.handleEditMode = this.handleEditMode.bind(this);
        this.handleFinalizeDialogOpen = this.handleFinalizeDialogOpen.bind(this);
        this.handleFinalizeDialogClose = this.handleFinalizeDialogClose.bind(this);
        this.handleOverrideDialogOpen = this.handleOverrideDialogOpen.bind(this);
        this.handleOverrideDialogClose = this.handleOverrideDialogClose.bind(this);
        this.handleAnchorMenu = this.handleAnchorMenu.bind(this);
        this.handleReleaseMenu = this.handleReleaseMenu.bind(this);
        this.handleFinalizeEdits = this.handleFinalizeEdits.bind(this);
        this.handleOverrideAllowed = this.handleOverrideAllowed.bind(this);
    }

    componentDidMount() {
        this.state.entries.length > 0 ?
            this.setState({
                entryDisplayIndex: this.state.entries.length
            })
        :
            this.setState({
                entryDisplayIndex: -1
            })
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

    //handle all case of OnChange
    handleOnChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    handleEditMode(event) {
        console.log(event);
        this.setState({
            editMode: !this.state.editMode
        })
    }

    handleFinalizeDialogOpen() {
        this.setState({
            finalizeDialogState: true
        })
    }

    //Dialog API requires an onClose() possibly closure by other means other than clicking cancel.
    handleFinalizeDialogClose() {
        this.setState({
            finalizeDialogState: false
        })
    }

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

    //handle Anchoring menu to FAB
    handleAnchorMenu(event) {
        console.log(event)
        this.setState({
            anchorEl: event.currentTarget
        })
    }

    //handles deAnchoring menu to FAB
    handleReleaseMenu() {
        this.setState({
            anchorEl: null
        })
    }

    //TODO push to exisiting repo
    async handleOverrideAllowed() {
        console.log("Override permission given")
    }

    //checks for existing repo by name and creates new repo if no existing. Otherwise prompts user for override.
    async handleFinalizeEdits() {
        console.log(this.state.repositoryName)
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

        return (
            <div className={classes.root}>
                {/* ALL edit related components go into this div */}
                {this.state.editMode ? 
                <div>
                    <Fab
                        name="editMode"
                        variant="extended"
                        size="medium"
                        color="primary"
                        aria-label="mode selector"
                        className={classes.modeFAB}
                        onClick={this.handleEditMode}
                    >
                        <FaEdit/>
                        Edit Mode
                    </Fab>
                    <Fab
                        name="anchorEl"
                        variant = 'extended'
                        size = 'medium'
                        color = 'primary'
                        aria-label = 'editor panel'
                        aria-controls = 'simple-menu'
                        aria-haspopup = 'true'
                        className = {classes.actionFAB}
                        onClick = {this.handleAnchorMenu}
                    >
                        <Typography variant = 'button'>Editor Panel</Typography>
                    </Fab>
                    <Menu
                        name="anchorEl"
                        anchorEl={this.state.anchorEl}
                        keepMounted
                        open={Boolean(this.state.anchorEl)}
                        onClose={this.handleReleaseMenu}
                    >
                        <MenuItem 
                            name="finalizeDialogState" 
                            onClick={this.handleFinalizeDialogOpen}
                        >
                            Finalize and Push
                        </MenuItem>
                        <MenuItem>Clear Template</MenuItem>
                        <MenuItem>Undo Action</MenuItem>
                        {/* <MenuItem onClick={this.handleChange}>Get Repo Content Testing</MenuItem> */}
                    </Menu>

                    <Dialog
                        name="finalizeDialogState"
                        open = {this.state.finalizeDialogState}
                        onClose = {this.handleFinalizeDialogClose}
                        aria-labelledby = "repo name input"
                    >
                        <DialogTitle id = "repo name input">
                            Repository Name
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText color = 'primary'>
                                Choose a Github repository name to save portfolio edits
                            </DialogContentText>
                            <TextField
                                name="repositoryName"
                                autoFocus
                                margin="dense"
                                label="Repository Name"
                                type="string"
                                defaultValue={this.state.repositoryName}
                                fullWidth
                                onChange={this.handleOnChange}
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button name="finalizeDialogState" onClick = {this.handleFinalizeDialogClose} color = 'primary'>
                                Cancel
                            </Button>
                            <Button onClick = {this.handleFinalizeEdits} color = 'primary'>
                                Finalize
                            </Button>
                        </DialogActions>
                    </Dialog>

                    <Dialog
                    name="overrideDialogState"
                        open = {this.state.overrideDialogState}
                        onClose = {this.handleOverrideDialogOpen}
                        aria-labelledby = "override permission input"
                    >
                        <DialogTitle id = "override permission input">
                            Warning!
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText color = 'primary'>
                                Repository already exists. This will override data in your existing repository and could lead to possible data loss! Do you still wish to continue?
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button name="overrideDialogState" onClick = {this.handleOverrideDialogClose} color = 'primary'>
                                Cancel
                            </Button>
                            <Button onClick = {this.handleOverrideAllowed} color = 'primary'>
                                Allow Override
                            </Button>
                        </DialogActions>
                    </Dialog>

                </div>
                : 
                <div>
                    <Fab
                        name="editMode"
                        variant="extended"
                        size="medium"
                        color="primary"
                        aria-label="mode selector"
                        className={classes.modeFAB}
                        onClick={this.handleEditMode}
                    >
                        <FaCheck />
                        Preview Mode
                    </Fab>
                </div>
                }
                {/* All portfolio related components go into this div */}
                {
                    this.state.entryDisplayIndex == -1 ?
                    <h3>You have no entries</h3>
                    :
                    this.renderElement(this.state.entries[this.state.entryDisplayIndex])
                    // this.state.entries.map((entry, index) => {
                    //     return this.renderElement(entry);
                    // })
                }
            </div>
        );
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