import React, { Component } from 'react';
import { connect } from 'react-redux';
import { repopulate_state } from '../actions/LoginAction';
import { withStyles } from '@material-ui/core/styles';
import TreeView from '@material-ui/lab/TreeView';
import { Typography, Modal, Icon, Tab, Tabs, ButtonBase, Card, CardMedia, CardContent, Fab } from '@material-ui/core';
import { TreeItem } from '@material-ui/lab';
import { templates } from '../templates/Templates';
import { FaPlus, FaSave, FaTimes, FaLink } from 'react-icons/fa';


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
    height: '100%',
  },
  modal: {
    overflow: 'scroll',
    display: 'flex',
    flexDirection: 'column',
    padding: '5%',
    height: '100%'
  },
  controlFAB: {
    position: 'static',
    marginRight: '0.5vw',
    marginBottom: '0.5vw'
  },
  treeItem: {
    '&$treeItemSelected > $treeItemContent': {
      backgroundColor: '#F00'
    }
  },
  treeItemSelected: {
  },
  treeItemExpanded: {
    // borderLeft: '1px dashed #FFF',
  },
  treeItemGroup: {
    marginLeft: 7,
    paddingLeft: 18,
    borderLeft: '1px dashed #FFF'
  },
  treeItemContent: {},
  treeView: {
    textAlign: 'left'
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
      currPage: "",
      dirTree: this.props.dirTree,
      showDirectory: false
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
      currPage: node
    });
  }

  /**
   * A function to recursively render the directory tree
   * @param {Map} dirTree the directory tree map to be used
   * @param {*} label the name of the current folder
   * @returns JSX component containing the TreeItem to be rendered
   */
  renderTree(dirTree, label) {
    const { classes } = this.props;

    return (
      <TreeItem
        value={dirTree.directory}
        nodeId={dirTree.directory}
        label={label}
        classes={{
          root: classes.treeItem,
          selected: classes.treeItemSelected,
          // expanded: classes.treeItemExpanded,
          content: classes.treeItemContent,
          group: classes.treeItemGroup
        }}
      >
        {Object.entries(dirTree.pages).map(([key, item]) => {
          return this.renderTree(item, key);
        })}
      </TreeItem>
    );
  }

  /**
   * 
   * 
   * @param {*} pageArray 
   * @param {*} dirTree 
   * @param {*} index 
   * @param {*} fullDir 
   */
  insertPage(pageArray, dirTree, index, fullDir) {
    if (index === pageArray.length - 1) {
      dirTree.pages[pageArray[index]] = {
        directory: fullDir,
        id: undefined,
        pages: {}
      }
    }
    else {
      this.insertPage(pageArray, dirTree.pages[pageArray[index]], index + 1, fullDir);
    }
  }

  handleCreatePage(newName) {
    const newDirectory = `${this.state.currPage}/${newName}`;
    const newDirTree = JSON.parse(JSON.stringify(this.state.dirTree));
    this.insertPage(newDirectory.split("/"), newDirTree, 1, newDirectory);
    this.props.onCreate(newDirTree, newName, newDirectory);
    this.setState({
      dirTree: newDirTree
    })
  }

  handleCloseDirectory(save) {
    // if (save) {

    // } else {
    //   // this.props.onClose(null, false);
    // }
    this.props.onClose(this.state.currPage);
    this.setState({
      showDirectory: false
    })
  }

  // TODO: add props dirTree={name:"", directory:"", id:number, pages:[]}
  // root page should not be renamed, since directory.root is hardcoded.
  render() {
    const { classes } = this.props;
    // should only have 1 root element for object.keys[0] to work
    console.log(this.props.dirTree)
    return (
      <div>
        <Fab
          className={classes.controlFAB}
          onClick={() => this.setState({ showDirectory: true })}>
          <FaLink />
        </Fab>
        <Modal className={classes.modal}
          open={this.state.showDirectory}
          onClose={() => this.handleCloseDirectory(true)}
          aria-labelledby="Directory Manager"
          aria-describedby="Select a page."
        >
          <div className={classes.root}>
            <Fab variant="extended" onClick={() => { this.handleCloseDirectory(false) }}>
              <FaTimes />
            </Fab>
            <TreeView
              defaultCollapseIcon={<FaTimes />}
              defaultExpandIcon={<FaSave />}
              onNodeSelect={this.handleSelectPage}
              onNodeToggle={this.handleToggle}
              className={classes.treeView}
            >
              {this.renderTree(this.state.dirTree, "root")}
            </TreeView>
            <Fab variant="extended" onClick={(event) => this.handleCreatePage("temp")}>
              <FaPlus />
              New page
            </Fab>
          </div>
        </Modal>
      </div>
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