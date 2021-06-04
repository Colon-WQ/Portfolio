import React, { Component } from 'react';
import { connect } from 'react-redux';
import { repopulate_state } from '../actions/LoginAction';
import { withStyles } from '@material-ui/core/styles';
import TreeView from '@material-ui/lab/TreeView';
import {Typography, Modal, Icon, Tab, Tabs, ButtonBase, Card, CardMedia, CardContent, Fab} from '@material-ui/core';
import TreeItem from '@material-ui/lab/TreeItem';
import {templates} from '../templates/Templates';
import {FaPlus, FaSave, FaTimes} from 'react-icons/fa';


/**
 * @file User Interface to allow users to switch between views.
 * 
 * @author Chuan Hao
 * 
 * @see DirectoryManager
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
        justifyContent: 'center',
        alignItems: 'center',
        padding: '2%',
        textAlign: 'center',
        backgroundColor: '#444444',
        opacity: '90%',
        height: '100%'
    },
    modal: {
      overflow: 'scroll',
      display: 'flex',
      flexDirection: 'column',
      padding: '5%',
      height: '100%'
    }
})

/**
 * User interface to allow users to select templates for each entry.
 * 
 * @component
 */
class DirectoryManager extends Component {
    /**
     * Populates state with fields passed in as attribute fields.
     * @constructor
     */
    constructor(props) {
        super(props);
        this.state = {
        }
        this.handleChange = this.handleChange.bind(this);
        this.renderTree = this.renderTree.bind(this);
    }

    /**
     * Attempts to fetch entry details where possible so settings are saved.
     * 
     * @property {Function} componentDidMount
     * @return void
     * @memberof DirectoryManager
     */
    componentDidMount() {
        // is this necessary if template is a widget
        if (!this.props.loggedIn) {
            const localStorageItem = JSON.parse(window.localStorage.getItem(process.env.REACT_APP_USER_LOCALSTORAGE))
            this.props.repopulate_state(localStorageItem)
        }
    }

    /**
     * Event handler to update states to reflect the selected category.
     * 
     * @param {*} event 
     * @param {string} newValue The category of entries selected.
     */
    handleChange(event, newValue) {
      this.setState({
        type: newValue
      });
    }

    handleSelect(event) {
      console.log(event);
    }

    handleToggle(event) {
      console.log(event);
    }

    renderTree(dirTree) {
      return (
      <TreeItem nodeId={dirTree.id} label={dirTree.directory === "" ? "root" : dirTree.directory}>
        {dirTree.pages.map((page, index) => this.renderTree(page))}
      </TreeItem>);
    }

    // TODO: add props dirTree={directory:"", id:number pages:[]}
    render() {
        const {classes} = this.props;
        console.log(this.props.dirTree)
        // TODO: change name/id to field-name-id to avoid collision i.e. colours-primary-0
        return (
            <Modal className = {classes.modal}
            // open always set to true, open/close logic handled by portfolio
              open={true}
              // TODO: add onClose save logic
              onClose={() => this.props.onClose(this.state)}
              aria-labelledby="Directory Manager"
              aria-describedby="Select a page."
            >
              <div className={classes.root}>
                <Fab>
                  <FaTimes/>
                </Fab>
                <TreeView
                  defaultCollapseIcon={<FaTimes/>}
                  defaultExpandIcon={<FaSave/>}
                  onNodeSelect={this.handleSelect}
                  onNodeToggle={this.handleToggle}
                >
                  {this.renderTree(this.props.dirTree)}
                </TreeView>
                <Fab variant="extended">
                  <FaPlus/>
                  New page
                </Fab>
              </div>
            </Modal>
        )
    }
}


/**
 * Function that maps variables from Redux Store to Home component's props.
 *
 * @param {Object} state - Redux Store
 * @memberof TemplateSelector
 */
const mapStateToProps = state => ({
    loggedIn: state.login.loggedIn
})

/** 
 * Provides action creators to Home component's props.
 * 
 * @type {Object.<Function>} 
 * @memberof TemplateSelector
 */
const mapDispatchToProps = {
    repopulate_state
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(DirectoryManager))