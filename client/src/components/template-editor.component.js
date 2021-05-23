import React, { Component } from 'react'
import { connect } from 'react-redux'
import { repopulate_state } from '../actions/login.action'
import axios from 'axios'
import { withStyles } from '@material-ui/core/styles'
import { Button, IconButton, TextField, Typography } from '@material-ui/core';
import { GrFormClose } from "react-icons/gr";

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


const fields = {
    text: '',
    img1: '',
    img2: '',
    img3: '',
    img4: '',
    primaryColour: '',
    secondaryColour: '',
    backgroundColour: '',
    link1: '',
    link2: '',
    link3: '',
    link4: '',
    primaryFontFamily: '',
    secondaryFontFamily: ''
}

const images = [ 'img1', 'img2', 'img3', 'img4' ];
const colours = [ 'primaryColour', 'secondaryColour', 'backgroundColour' ];
const fonts = [ 'primaryFontFamily', 'secondaryFontFamily' ];
// TODO: populate array dynamically
const availableFonts = [ 'Roboto', 'Comic sans' ];

// ### params
// onClose: function to update parent element on close. takes in state as input
// fields: { text: { label: ..., }}
// show: boolean, hides editor otherwise
class TemplateEditor extends Component {
    constructor() {
        super();
        this.state = {
            ...fields,
        }
    }

    componentDidMount() {
        // is this necessary if template is a widget
        if (!this.props.loggedIn) {
            const localStorageItem = JSON.parse(window.localStorage.getItem(process.env.REACT_APP_USER_LOCALSTORAGE))
            this.props.repopulate_state(localStorageItem)
        }
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

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    handleImageUpload(event) {
        // TODO: Open a upload dialog
        const img = ""
        this.setState({
            [event.target.name]: img
        })
    }

    render() {
        const { classes } = this.props;

        return (
            <div className = { this.props.show ? classes.root : classes.hide}>
                <IconButton onClick={() => this.props.onClose(this.state)}>
                    <GrFormClose/>
                </IconButton>

                <div className = {classes.contentDiv}>
                    <TextField id='text' variant='outlined' 
                    label={ this.props.fields.text === undefined 
                        || this.props.fields.text.label === undefined ? 'Component text' : this.props.fields.text.label } 
                    className={ this.props.fields.text === undefined ? classes.hide : classes.textField }
                    onChange={this.handleChange}/>

                    {images.map((img, index) => {
                        if(this.props.fields[img] === undefined) return;
                        // dynamic variable name
                        return (<div>
                                <Button variant="outlined" onClick={this.handleChange}>
                                <img src={this.state.fields[img]} 
                                alt={this.props.fields[img].label === undefined ? 'Upload image' : 
                                "Upload " + this.props.fields[img].label}/>
                                </Button>
                            </div>);
                    })}
                </div>
                <div className={classes.themeDiv}>
                    {colours.map((col, index) => {
                        if(this.props.fields[col] === undefined) return;
                        return (<div>
                            <Button style={`background-color: ${this.state[col]}`}>
                                Should be changed to icon
                            </Button>
                            <TextField id={col} variant='outlined' 
                            label={col} onChange={this.handleChange}/>
                        </div>);
                    })}
                    {colours.map((font, index) => {
                        if(this.props.fields[font] === undefined) return;
                        return (<div>
                            <Button style={`background-color: ${this.state[font]}`}>
                                Should be changed to icon
                            </Button>
                            <TextField id={font} variant='outlined' 
                            label={font} onChange={this.handleChange}/>
                        </div>);
                    })}
                </div>
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