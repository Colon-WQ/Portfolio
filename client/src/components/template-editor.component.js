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
            repo: ''
        }
        this.handleMenuClick = this.handleMenuClick.bind(this);
        this.handleMenuClose = this.handleMenuClose.bind(this);
        this.handleFinalize = this.handleFinalize.bind(this);
        this.handleFinalizeDialogClose = this.handleFinalizeDialogClose.bind(this);
        this.handleFinalizeEdits = this.handleFinalizeEdits.bind(this);
        this.handleRepoChange = this.handleRepoChange.bind(this);
        this.handleClearTemplate = this.handleClearTemplate.bind(this);
        this.handleUndo = this.handleUndo.bind(this);
    }

    componentDidMount() {
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
                repo: 'todo_list'
            }
        }).then(res => {
            console.log(res.data.message)
        }).catch(err => {
            console.log(err.response.data)
        })

        this.setState({
            finalizeDialogState: false,
            repo: ''
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