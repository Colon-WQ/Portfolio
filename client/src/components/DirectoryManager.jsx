import React, { Component } from 'react';
import { connect } from 'react-redux';
import { repopulate_state } from '../actions/LoginAction';
import { withStyles } from '@material-ui/core/styles';
import TreeView from '@material-ui/lab/TreeView';
import { Typography, Modal, Icon, Tab, Tabs, ButtonBase, Card, CardMedia, CardContent, Fab } from '@material-ui/core';
import TreeItem from '@material-ui/lab/TreeItem';
import { templates } from '../templates/Templates';
import { FaPlus, FaSave, FaTimes } from 'react-icons/fa';


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
      originalPage: this.props.cancelTo,
      newPage: this.props.cancelTo
    }
    this.handleSelectPage = this.handleSelectPage.bind(this);
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
   * Event handler to update states to reflect the selected page.
   * 
   * @param {*} event 
   * @param {string} node The id of the page selected.
   */
  handleSelectPage(event, node) {
    this.setState({
      newPage: node
    });
  }

  renderTree(dirTree, label) {
    return (
      <TreeItem value={dirTree.directory} nodeId={dirTree.id} label={label}>
        {Object.entries(dirTree.pages).map(([key, item]) => {
          return this.renderTree(item, key);
        })}
      </TreeItem>);
  }

  insertPage(pageArray, dirTree, index, fullDir) {
    if (index !== pageArray.length - 1) {
      this.insertPage(pageArray, dirTree.pages[pageArray[index]], index + 1);
    } else {
      dirTree.pages[pageArray[index]] = {
        directory: fullDir,
        id: undefined,
        pages: {}
      }
    }
  }

  handleCreatePage(currentDirectory, newName) {
    const newDirectory = `${currentDirectory}/${newName}`;
    const newDirTree = JSON.parse(JSON.stringify(this.props.dirTree));
    this.insertPage(newDirectory.split("/"), newDirTree, 0, newDirectory);
    this.props.onCreate(newDirTree, newName, newDirectory);
  }

  // TODO: add props dirTree={name:"", directory:"", id:number, pages:[]}
  render() {
    const { classes } = this.props;
    console.log(this.props.dirTree)
    // should only have 1 root element for object.keys[0] to work
    return (
      <Modal className={classes.modal}
        open={true}
        onClose={() => this.props.onClose(this.state.newPage)}
        aria-labelledby="Directory Manager"
        aria-describedby="Select a page."
      >
        <div className={classes.root}>
          <Fab>
            <FaTimes />
          </Fab>
          <TreeView
            defaultCollapseIcon={<FaTimes />}
            defaultExpandIcon={<FaSave />}
            onNodeSelect={this.handleSelectPage}
            onNodeToggle={this.handleToggle}
          >
            {this.renderTree(this.props.dirTree, Object.keys(this.props.dirTree)[0])}
          </TreeView>
          <Fab variant="extended">
            <FaPlus />
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