import React, { Component } from 'react'
import { connect } from 'react-redux'
import { repopulate_state } from '../actions/login.action'
import axios from 'axios'
import { withStyles } from '@material-ui/core/styles'
import { Button, IconButton, TextField, Typography } from '@material-ui/core';
import { GrFormClose } from "react-icons/gr";
import { Base64 } from 'js-base64';

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

const images = [ 'img1', 'img2', 'img3', 'img4' ];
const colours = [ 'primaryColour', 'secondaryColour', 'backgroundColour' ];
const fonts = [ 'primaryFontFamily', 'secondaryFontFamily' ];
// TODO: populate array dynamically
const availableFonts = [ 'Roboto', 'Comic sans' ];

const templateGenerators = {
    // TYPE: [style1, style2, ...], style == (dict) => <Component/>
    ENTRY: [],
    ABOUT: [],
    TIMELINE: []
}

// ### params
// editMode: add edit button to components
// onPublish: @param function that recieves js @return dictionary containing componentID: function to encode
// TODO: discuss whether to store js string here or under main site
class PortfolioGenerator extends Component {
    constructor() {
        super();
        this.state = {
            entries: []
        }

    }

    renderElement(entry) {
        return templateGenerators[entry.type][entry.style](entry);
    }

    render() {
        const { classes } = this.props;

        return (<div>
            {this.props.editMode ? <IconButton>edit icon</IconButton> : null}
            {this.state.entries.map((entry, index) => {
                return this.renderElement(entry);
            })}
            </div>);
    }
}

const mapStateToProps = state => ({
    loggedIn: state.login.loggedIn,
    name: state.login.name
})

const mapDispatchToProps = {
    repopulate_state
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(PortfolioGenerator))