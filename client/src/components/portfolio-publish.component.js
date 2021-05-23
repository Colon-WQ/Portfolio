import React, { Component } from 'react'
import { connect } from 'react-redux'
import { repopulate_state } from '../actions/login.action'
import axios from 'axios'
import Fab from '@material-ui/core/Fab';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { withStyles } from '@material-ui/core/styles'
import { Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

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

class TemplateEditor extends Component {
    constructor() {
        super();
        this.state = {
            anchorEl: null,
            finalizeDialogState: false,
            overrideDialogState: false,
            repo: ""
        }
        this.handleMenuClick = this.handleMenuClick.bind(this);
        this.handleMenuClose = this.handleMenuClose.bind(this);
        this.handleFinalize = this.handleFinalize.bind(this);
        this.handleFinalizeDialogClose = this.handleFinalizeDialogClose.bind(this);
        this.handleFinalizeEdits = this.handleFinalizeEdits.bind(this);
        this.handleRepoChange = this.handleRepoChange.bind(this);
        this.handleOverrideDialogClose = this.handleOverrideDialogClose.bind(this);
        this.handleOverrideAllowed = this.handleOverrideAllowed.bind(this);
        this.handleClearTemplate = this.handleClearTemplate.bind(this);
        this.handleUndo = this.handleUndo.bind(this);
        this.handleGetRepoContent = this.handleGetRepoContent.bind(this);
    }

    componentDidMount() {
        // is this necessary if template is a widget
        if (!this.props.loggedIn) {
            const localStorageItem = JSON.parse(window.localStorage.getItem(process.env.REACT_APP_USER_LOCALSTORAGE))
            this.props.repopulate_state(localStorageItem)
        }
    }

    handleMenuClick(event) {
        this.setState({
            anchorEl: event.currentTarget
        })
    }

    handleMenuClose() {
        this.setState({
            anchorEl: null
        })
    }

    handleFinalize() {
        
        this.setState({
            anchorEl: null,
            finalizeDialogState: true
        })
    }

    handleFinalizeDialogClose() {
        this.setState({
            finalizeDialogState: false,
            repo: ''
        })
    }

    async handleFinalizeEdits() {
        await axios({
            method: "GET",
            url: process.env.REACT_APP_BACKEND + "/portfolio/checkExistingRepos",
            withCredentials: true,
            params: {
                repo: this.state.repo
            }
        }).then(async res => {
            console.log(res.data.message)
            await axios({
                method: "POST",
                url: process.env.REACT_APP_BACKEND + "/portfolio/createRepo",
                withCredentials: true,
                data: {
                    repo: this.state.repo
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
            repo: ''
        })
    }

    handleOverrideDialogClose() {
        this.setState({
            overrideDialogState: false
        })
    }

    handleOverrideAllowed() {
        //TODO Push to repo OR recreate repository
        this.setState({
            overrideDialogState: false
        })
    }

    handleRepoChange(event) {
        this.setState({
            repo: event.target.value
        })
    }

    handleClearTemplate() {
        this.setState({
            anchorEl: null
        })
    }

    handleUndo() {
        this.setState({
            anchorEl: null
        })
    }

    handleGetRepoContent() {
        axios({
            method: "GET",
            url: process.env.REACT_APP_BACKEND + "/portfolio/getRepoContent",
            withCredentials: true,
            params: {
                repo: "testShit"
            }
        }).then(res => {
            console.log(res.data.content)
        }).catch(err => {
            console.log(err.response.data)
        })
    }

// Base64.encode(string);, Base64.decode(string);

    


    render() {
        const { classes } = this.props

        return (
            <div className = {classes.root}>
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
                            autoFocus
                            margin="dense"
                            id="name"
                            label="Repository Name"
                            type="string"
                            fullWidth
                            onChange={this.handleRepoChange}
                        />
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
                
                <Fab
                    variant = 'extended'
                    className = {classes.floating}
                    size = 'medium'
                    color = 'primary'
                    aria-label = 'editor panel'
                    aria-controls = 'simple-menu'
                    aria-haspopup = 'true'
                    onClick = {this.handleMenuClick}
                >
                    <Typography variant = 'button'>Editor Panel</Typography>
                </Fab>
                <Menu
                    id="simple-menu"
                    anchorEl={this.state.anchorEl}
                    keepMounted
                    open={Boolean(this.state.anchorEl)}
                    onClose={this.handleMenuClose}
                >
                    <MenuItem onClick={this.handleFinalize}>Finalize and Push</MenuItem>
                    <MenuItem onClick={this.handleClearTemplate}>Clear Template</MenuItem>
                    <MenuItem onClick={this.handleUndo}>Undo Action</MenuItem>
                    <MenuItem onClick={this.handleGetRepoContent}>Get Repo Content Testing</MenuItem>
                </Menu>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    loggedIn: state.login.loggedIn,
    name: state.login.name
})

const mapDispatchToProps = {
    repopulate_state
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(TemplateEditor))