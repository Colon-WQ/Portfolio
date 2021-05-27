import React, { Component } from 'react'
import { connect } from 'react-redux'
import { repopulate_state } from '../actions/LoginAction'
import axios from 'axios'
import { GrFormClose } from "react-icons/gr";
import { Base64 } from 'js-base64';
import PropTypes from 'prop-types';
import EntryEditor from './EntryEditor'

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
        this.handleStateChange = this.handleStateChange.bind(this);
        this.handleFinalizeDialogOpen = this.handleFinalizeDialogOpen.bind(this);
        this.handleFinalizeDialogClose = this.handleFinalizeDialogClose.bind(this);
        this.handleOverrideDialogOpen = this.handleOverrideDialogOpen.bind(this);
        this.handleOverrideDialogClose = this.handleOverrideDialogClose.bind(this);
        this.handleAnchorMenu = this.handleAnchorMenu.bind(this);
        this.handleReleaseMenu = this.handleReleaseMenu.bind(this);
        this.handleFinalizeEdits = this.handleFinalizeEdits.bind(this);
        this.handleOverrideAllowed = this.handleOverrideAllowed.bind(this);
        this.handlePushToGithub = this.handlePushToGithub.bind(this);
    }

    componentDidMount() {
        if (this.state.entries.length > 0) {
            this.setState({
                entryDisplayIndex: this.state.entries.length
            })
        } else {
            this.setState({
                entryDisplayIndex: -1
            })
        }

        if (!this.props.loggedIn) {
            const localStorageItem = JSON.parse(window.localStorage.getItem(process.env.REACT_APP_USER_LOCALSTORAGE))
            this.props.repopulate_state(localStorageItem)
        }
    }

    renderElement(entry) {
        return templateGenerators[entry.type][entry.style](entry);
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
        //console.log(customAttribute)
        //console.log(this.state[customAttribute])
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
        //console.log(anchorEl)
        this.setState({
            [anchorEl]: event.currentTarget
        })
    }

    //handles any form of deAnchoring menu from FAB
    handleReleaseMenu(event) {
        const anchorEl = event.currentTarget.getAttribute("componentname");
        //console.log(anchorEl)
        this.setState({
            [anchorEl]: null
        })
    }

    //TODO push to exisiting repo testing in progress
    //routes set to nothing for now
    //hardcoded name for now
    //console.log is run but nothing happens. route is correct
    async handleOverrideAllowed() {
        console.log(`Override permission given to push to ${this.state.repositoryName} and toggle pages for it`)
        await this.handlePushToGithub();
        this.setState({
            overrideDialogState: false
        })
    }

    //Note: If you wish to create a file under a folder. Under fileName, add "/folder/{filename}"
    //Note: For testing purposes, all files will be named "index".
    //Note: For testing purposes, there will only be two files, a HTML and CSS file in root directory.
    async handlePushToGithub() {
        console.log(`files are being pushed to ${this.state.repositoryName}`)
        await axios({
            method: "PUT",
            url: process.env.REACT_APP_BACKEND + "/portfolio/publishGithub",
            withCredentials: true,
            data: {
                route: "",
                content: [
                    {
                        fileType: ".html",
                        fileName: "index",
                        fileContent: Base64.encode(this.state.repositoryHTML)
                    },
                    {
                        fileType: ".css",
                        fileName: "index",
                        fileContent: Base64.encode(this.state.repositoryCSS)
                    }
                ],
                repo: this.state.repositoryName
            }
        }).then(res => {
            console.log(res.data.message);
        }).catch(err => {
            if (err.response) {
                console.log(err.response.data);
            } else {
                console.log(err.message);
            }
        })
    }

    //checks for existing repo by name and creates new repo if no existing. Otherwise prompts user for override.
    //Once new repo is created, inputs will be automatically pushed.
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
            //waits for repository to be created
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
                if (err.response) {
                    console.log(err.response.data);
                } else {
                    console.log(err.message);
                }
            })

            //Waits for push to go through
            await this.handlePushToGithub();
        }).catch(err => {
            if (err.response) {
                console.log(err.response.data);
            } else {
                console.log(err.message);
            }
            
            this.setState({
                overrideDialogState: true
            })
        })

        //closes finalizeDialog but doesn't remove repository name.
        //TODO: Repository name should not be set in dialog, but in some easily visible spot.
        this.setState({
            finalizeDialogState: false
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
                        componentname="editMode"
                        variant="extended"
                        size="medium"
                        color="primary"
                        aria-label="mode selector"
                        className={classes.modeFAB}
                        onClick={this.handleStateChange}
                    >
                        <FaEdit/>
                        Edit Mode
                    </Fab>
                    <Fab
                        componentname="anchorEl"
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
                        componentname="anchorEl"
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
                        
                            <DialogContentText color = 'primary'>
                                Input HTML string (for testing purposes)
                            </DialogContentText>
                            <TextField
                                name="repositoryHTML"
                                margin="dense"
                                label="Repository HTML (testing)"
                                type="string"
                                fullWidth
                                onChange={this.handleOnChange}
                            >
                            </TextField>

                            <DialogContentText color = 'primary'>
                                Input CSS string (for testing purposes)
                            </DialogContentText>
                            
                            <TextField
                                name="repositoryCSS"
                                margin="dense"
                                label="Repository CSS (testing)"
                                fullWidth
                                onChange={this.handleOnChange}
                            >
                            </TextField>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick = {this.handleFinalizeDialogClose} color = 'primary'>
                                Cancel
                            </Button>
                            <Button onClick = {this.handleFinalizeEdits} color = 'primary'>
                                Finalize
                            </Button>
                        </DialogActions>
                    </Dialog>

                    <Dialog
                        open = {this.state.overrideDialogState}
                        onClose = {this.handleOverrideDialogClose}
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
                            <Button onClick = {this.handleOverrideDialogClose} color = 'primary'>
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
                        componentname="editMode"
                        variant="extended"
                        size="medium"
                        color="primary"
                        aria-label="mode selector"
                        className={classes.modeFAB}
                        onClick={this.handleStateChange}
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