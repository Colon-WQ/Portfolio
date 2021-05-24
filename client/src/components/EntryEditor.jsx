import React, { Component } from 'react'
import { connect } from 'react-redux'
import { repopulate_state } from '../actions/LoginAction'
import axios from 'axios'
import { withStyles } from '@material-ui/core/styles'
import { Button, IconButton, TextField, Typography } from '@material-ui/core';
import { GrFormClose } from "react-icons/gr";
import PropTypes from 'prop-types';


/**
 * @file EntryEditor component to provide a user interface for users to style their entries
 * 
 * @author Chuan Hao
 * 
 * @see EntryEditor
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


/** 
 *  Array of key names for image inputs, represented as strings.
 * 
 * @type {Array.<string>} 
 * @memberof EntryEditor
 */
const images = [ 'img1', 'img2', 'img3', 'img4' ];

/** 
 * Array of key names for colour choices.
 * 
 * @type {Array.<string>} 
 * @memberof EntryEditor
 */
const colours = [ 'primaryColour', 'secondaryColour', 'backgroundColour' ];

/** 
 * Array of key names for font choices.
 * 
 * @type {Array.<string>} 
 * @memberof EntryEditor
 */
const fonts = [ 'primaryFontFamily', 'secondaryFontFamily' ];
// TODO: populate array dynamically
const availableFonts = [ 'Roboto', 'Comic sans' ];

/**
 * The dashboard logged in users will use to navigate the page.
 * 
 * @component
 * @example
 * return (<EntryEditor fields={text:'Your name here' img1:'Homepage image'} show=true/>)
 */
class EntryEditor extends Component {
    static propTypes = {
        fields: PropTypes.shape({
            text: PropTypes.string,
            img1: PropTypes.string,
            img2: PropTypes.string,
            img3: PropTypes.string,
            img4: PropTypes.string,
            primaryColour: PropTypes.string,
            secondaryColour: PropTypes.string,
            backgroundColour: PropTypes.string,
            link1: PropTypes.string,
            link2: PropTypes.string,
            link3: PropTypes.string,
            link4: PropTypes.string,
            primaryFontFamily: PropTypes.string,
            secondaryFontFamily: PropTypes.string
        }),
        show: PropTypes.bool
    };

    // TODO: check if componenetDidMount can overwrite constructor
    /**
     * Populates state with fields passed in as attribute fields.
     * @constructor
     */
    constructor() {
        super();
        this.state = {
            ...this.props.fields,
        }
    }

    // TODO: elements read from state instead of props
    // TODO: unbounded mongo models
    /**
     * Attempts to fetch entry details where possible so settings are saved.
     * 
     * @property {Function} componentDidMount
     * @return void
     * @memberof EntryEditor
     */
    componentDidMount() {
        // is this necessary if template is a widget
        if (!this.props.loggedIn) {
            const localStorageItem = JSON.parse(window.localStorage.getItem(process.env.REACT_APP_USER_LOCALSTORAGE))
            this.props.repopulate_state(localStorageItem)
        }
    }

    /**
     * Autosave function that should save edits to the current portfolio into mongodb.
     * 
     * @property {Function} handleFinalizeEdits
     * @return response received
     * @memberof EntryEditor
     */
    async handleFinalizeEdits() {
        // await axios({
        //     method: "GET",
        //     url: process.env.REACT_APP_BACKEND + "/portfolio/checkExistingRepos",
        //     withCredentials: true,
        //     params: {
        //         repo: this.state.repo
        //     }
        // }).then(async res => {
        //     console.log(res.data.message)
        //     await axios({
        //         method: "POST",
        //         url: process.env.REACT_APP_BACKEND + "/portfolio/createRepo",
        //         withCredentials: true,
        //         data: {
        //             repo: this.state.repo
        //         }
        //     }).then(response => {
        //         console.log(response.data.message)
        //     }).catch(err => {
        //         console.log(err.message)
        //         console.log("repository creation failed")
        //     })
        // }).catch(err => {
        //     console.log(err.response.data)
        //     this.setState({
        //         overrideDialogState: true
        //     })
        // })

        // this.setState({
        //     finalizeDialogState: false,
        //     repo: ''
        // })
    }

    /**
     * Event handler for text fields. 
     * Text fields should be named after their keys in the state.
     * 
     * @property {Function} handleChange
     * @param {*} event 
     * @return void
     * @memberof EntryEditor
     */
    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    // TODO: implement file upload logic. possibly save disk reference/localStorage for efficiency
    /**
     * Event handler for text fields. 
     * Text fields should be named after their keys in the state.
     * 
     * @property {Function} handleImageUpload
     * @param {*} event 
     * @return void
     * @memberof EntryEditor
     */
    handleImageUpload(event) {
        // TODO: Open a upload dialog
        const img = ""
        this.setState({
            [event.target.name]: img
        })
    }

    render() {
        const { classes } = this.props;
        // TODO: read from state instead of props so edit retains options
        return (
            <div className = { classes.root }>
                <IconButton onClick={() => this.props.onClose(this.state)}>
                    <GrFormClose/>
                </IconButton>
                <div className = {classes.contentDiv}>
                    <TextField name='text' id='text' variant='outlined' 
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
                        // if(this.props.fields[col] === undefined) return;
                        return (<div>
                            <Button style={`background-color: ${this.state[col]}`}>
                                Should be changed to icon
                            </Button>
                            <TextField id={col} variant='outlined' 
                            label={col} onChange={this.handleChange}/>
                        </div>);
                    })}
                    {colours.map((font, index) => {
                        // if(this.props.fields[font] === undefined) return;
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

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(EntryEditor))