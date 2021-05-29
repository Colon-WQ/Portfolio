import React, { Component } from 'react'
import { connect } from 'react-redux'
import { repopulate_state } from '../actions/LoginAction'
import axios from 'axios'
import { Base64 } from 'js-base64';

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





/**
 * @file Publish component representing user interface for publishing portfolios to ghpages.
 * 
 * @author Chen En
 * 
 * @see Publish
 */

/**
 * Style generator to dynamically adjust styles based on theme provided
 * @param theme 
 * @returns classes passed as props to the component, with values provided by parameter theme
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

/**
 * The publish component renders functionalities to allow user to publish their
 * portfolio to ghpages.
 * 
 * The component contains state variables repositoryHTML, repositoryCSS, repositoryJS.
 * 
 * @component
 */
class Publish extends Component {
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
            finalizeDialogState: false,
            overrideDialogState: false,
            repositoryName: "",
            repositoryContent: [],
            anchorEl: null,
            fileName: "",
            fileContent: ""
        }
        this.handleOnChange = this.handleOnChange.bind(this);
        this.handleAddFileContent = this.handleAddFileContent.bind(this);
        this.handleAddToFileContent = this.handleAddToFileContent.bind(this);
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

    /**
     * Attempts to fetch user details and logged in status from localStorage after component is rendered.
     * 
     * @property {Function} componentDidMount
     * @return void
     * @memberof Publish
     */
    componentDidMount() {
        if (!this.props.loggedIn) {
            const localStorageItem = JSON.parse(window.localStorage.getItem(process.env.REACT_APP_USER_LOCALSTORAGE))
            this.props.repopulate_state(localStorageItem)
        }
    }

    /**
     * Handles onChange events. Changes a state variable under the name of the event target to value provided by user.
     *
     * @property {Function} handleOnChange
     * @param {Object} event
     * @return void
     * @memberof Publish
     */
    handleOnChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    /**
     * Handles addition of files in the form of objects to the state variable repositoryContent. If file to be added
     * share the same name as an existing file in repositoryContent, the fileContent of the exisitng file will be
     * overwritten by the new file's contents.
     *
     * @property {Function} handleAddFileContent
     * @param {Object} event
     * @return void
     * @memberof Publish
     */
    handleAddFileContent(event) {
        event.preventDefault();
        const temp = this.state.repositoryContent;
        
        let duplicate = false;
        for (let obj of temp) {
            if (obj.fileName === this.state.fileName) {
                duplicate = true;
                obj.fileContent = this.state.fileContent
                break;
            }
        }
        if (!duplicate) {
            temp.push({
                fileName: this.state.fileName,
                fileContent: Base64.encode(this.state.fileContent)
            });
            this.setState({
                repositoryContent: temp
            })
        } else {
            console.log("duplicate file not added")
        }
    }

    
    /**
     * Test function to be passed down as props to child components.
     *
     * @param {Array.<Object>} files
     * @memberof Publish
     */
    handleAddToFileContent(files) {
        const temp = this.state.repositoryContent;

        for (let file of files) {
            let duplicate = false;
            for (let obj of temp) {
                if (file.name === obj.fileName) {
                    duplicate = true;
                    obj.fileContent = file.contents
                    break;
                }
            }
            if (!duplicate) {
                temp.push({
                    fileName: file.name,
                    fileContent: file.contents
                })
            } else {
                console.log(`duplicate file ${file.name} not added`)
            }
        }

        this.setState({
            repositoryContent: temp
        })
    }

    /**
     * Handles the opening of finalize dialog by setting state boolean finalizeDialogState to true.
     * 
     * @property {Function} handleFinalizeDialogOpen
     * @return void
     * @memberof Publish
     */
    handleFinalizeDialogOpen() {
        this.setState({
            anchorEl: null,
            finalizeDialogState: true
        })
    }

    /**
     * Handles the closing of finalize dialog by setting state boolean finalizeDialogState to false.
     * 
     * @property {Function} handleFinalizeDialogClose
     * @return void
     * @memberof Publish
     */
    handleFinalizeDialogClose() {
        this.setState({
            finalizeDialogState: false
        })
    }

    /**
     * Handles the opening of override dialog by setting state boolean overrideDialogState to true.
     * 
     * @property {Function} handleOverrideDialogOpen
     * @return void
     * @memberof Publish
     */
    handleOverrideDialogOpen() {
        this.setState({
            overrideDialogState: true
        })
    }

    /**
     * Handles the closing of override dialog by setting state boolean overrideDialogState to false.
     * 
     * @property {Function} handleOverrideDialogClose
     * @return void
     * @memberof Publish
     */
    handleOverrideDialogClose() {
        this.setState({
            overrideDialogState: false
        })
    }

    //handle any form of anchoring menu to FAB
    // Note: Store it under separate custom attribute. id shld be saved for reference purposes and must be unique.
    // Warning: eact does not recognize the `componentName` prop on a DOM element. 
    // If you intentionally want it to appear in the DOM as a custom attribute, spell it as lowercase `componentname` instead.
    // custom attributes must be lowercase.

    /**
     * Handles the expanding of menu by setting state variable with name matching component prop 'componentname' of the component
     * which fired the event to the component itself.
     * Note: Usage of 'componentname' prop to store the name of state variable to be changed via this method.
     * 
     * @param {Object} event
     * @return void
     * @memberof Publish
     */
    handleAnchorMenu(event) {
        const anchorEl = event.currentTarget.getAttribute("componentname")
        //console.log(anchorEl)
        this.setState({
            [anchorEl]: event.currentTarget
        })
    }

    /**
     * Handles the closing of menu by setting state variable with name matching component prop 'componentname' of the component
     * which fired the event to null.
     *
     * @param {Object} event
     * @return void
     * @memberof Publish
     */
    handleReleaseMenu(event) {
        const anchorEl = event.currentTarget.getAttribute("componentname");
        //console.log(anchorEl)
        this.setState({
            [anchorEl]: null
        })
    }

    
    /**
     * Handles 
     *
     * @memberof Publish
     */
    async handleOverrideAllowed() {
        console.log(`Override permission given to push to ${this.state.repositoryName} and toggle pages for it`)
        await this.handlePushToGithub();
        this.setState({
            overrideDialogState: false
        })
    }

    //Note: If you wish to create a file under a folder. Under fileName, add "folder/{filename}.{fileType}"
    //This clears out the array to push after pushing as well as the fileName and fileContent, which are for testing.
    async handlePushToGithub() {
        console.log(`files are being pushed to ${this.state.repositoryName}`)
        await axios({
            method: "PUT",
            url: process.env.REACT_APP_BACKEND + "/portfolio/publishGithub",
            withCredentials: true,
            data: {
                route: "",
                content: this.state.repositoryContent,
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

        this.setState({
            repositoryContent: [],
            fileName: "",
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
                <Fab
                    componentname="anchorEl"
                    variant = 'extended'
                    size = 'medium'
                    color = 'primary'
                    aria-label = 'publish panel'
                    aria-controls = 'simple-menu'
                    aria-haspopup = 'true'
                    className = {classes.actionFAB}
                    onClick = {this.handleAnchorMenu}
                >
                    <Typography variant = 'button'>Publish</Typography>
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
                        {/* Likely NOT needed for actual publishing. However, here for testing purposes */}
                        <DialogContentText color = 'primary'>
                            Add a file to Push (for testing purposes)
                        </DialogContentText>
                        <form >
                            <label for="fileName">File Name</label>
                            <input type="text" id="fileName" name="fileName" placeholder="file name including repository path" onChange={this.handleOnChange}></input>
                            <br />
                            <label for="fileContent">File Content</label>
                            <input type="text" id="fileContent" name="fileContent" placeholder="your file content" onChange={this.handleOnChange}></input>
                            <br />
                            <button onClick={this.handleAddFileContent}>Add</button>
                        </form>
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
    loggedIn: state.login.loggedIn
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

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Publish))