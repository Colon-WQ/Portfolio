import React, { Component } from 'react';
import { connect } from 'react-redux';
import { repopulate_state } from '../actions/LoginAction';
import { withStyles } from '@material-ui/core/styles';
import TreeView from '@material-ui/lab/TreeView';
import { Typography, Modal, Icon, Tab, Tabs, ButtonBase, Card, CardMedia, CardContent, Fab, TextField } from '@material-ui/core';
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
    backgroundColor: theme.palette.background.default,
    opacity: '85%',
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
      backgroundColor: theme.palette.contrastPrimary.main
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
    borderLeft: `1px dashed ${theme.palette.text.primary}`
  },
  treeItemContent: {},
  treeView: {
    textAlign: 'left'
  },
  textField: {},
  hide: {
    display: 'none'
  }
})

const RENAME = 0;
const CREATE = 1;

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
      currentPage: this.props.dirTree,
      currentPath: [],
      showInput: false,
      dirTree: this.props.dirTree,
      showDirectory: false,
      dirName: "",
      inputMode: RENAME,
      expanded: []
    }
    this.handleSelectPage = this.handleSelectPage.bind(this);
    this.renderTree = this.renderTree.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleDeletePage = this.handleDeletePage.bind(this);
    this.handleRenameDirectory = this.handleRenameDirectory.bind(this);
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
   * @param {object} node The id of the page selected. 
   * MUI api indicates node is supposed to be a string but object seems to work.
   */
  handleSelectPage(event, node, path) {
    // preventDefault prevents onNodeToggle from being called.
    event.preventDefault();
    this.setState({
      currentPage: node,
      currentPath: path
    });
  }

  /**
   * A function to recursively render the directory tree
   * @param {Map} dirTree the directory tree map to be used
   * @param {*} folder the name of the current folder
   * @returns JSX component containing the TreeItem to be rendered
   */
  renderTree(dirTree, folder, classes, directoryArray) {

    return (
      <TreeItem
        value={folder}
        nodeId={folder}
        label={folder}
        classes={{
          root: classes.treeItem,
          selected: classes.treeItemSelected,
          // expanded: classes.treeItemExpanded,
          content: classes.treeItemContent,
          group: classes.treeItemGroup
        }}
        onLabelClick={(event) => this.handleSelectPage(event, dirTree, directoryArray)}
      >
        {Object.entries(dirTree.directories).map(([key, item]) => {
          return this.renderTree(item, key, classes, [...directoryArray, key]);
        })}
      </TreeItem>
    );
  }

  // TODO: can combine with other directory tree traversals to imporve code reuse
  /**
   * Auxillary function to get a directory from a path array
   * 
   * @param {[string]} pageArray the array of directories to be traversed
   * @param {{map}} dirTree the current directory
   * @param {number} index the index of the current durectory in pageArray
   * @returns {object} The parent directory if successful, undefined otherwise.
   */
  getPage(pageArray, dirTree, index) {
    // TODO: test if === causes any bugs -- >= might cause unexpected behaviour down the line
    if (index >= pageArray.length) {
      // prevent overwriting
      if (dirTree === undefined) return undefined;
      return dirTree;
    }
    else {
      return this.getPage(pageArray, dirTree.directories[pageArray[index]], index + 1);
    }
  }

  /**
   * Event handler to create a new page
   * 
   * @param {string} newName the name of the new page
   */
  handleCreatePage(newName) {
    const newDirTree = JSON.parse(JSON.stringify(this.state.dirTree));
    const parent = this.getPage(this.state.currentPath, newDirTree, 0);
    console.log(this.state.currentPath)
    console.log(parent);
    console.log(newDirTree);
    const newPage = {
      directory: newName,
      entries: [],
      directories: {},
      id: undefined
    };
    parent.directories[newName] = newPage;

    this.props.onUpdate(newDirTree);
    console.log(this.state)
    this.setState({
      dirTree: newDirTree,
      currentPage: parent,
      showInput: false
    })
  }

  /**
   * Event handler to update portfolio preview on directory change
   * @param {boolean} save whether the user wishes to change the view to the selected directory
   */
  handleCloseDirectory(save) {
    this.props.onClose(this.state.currentPage, this.state.currentPath);
    this.setState({
      showDirectory: false
    })
  }

  /**
   * Generic event handler for updating state via componenent name
   * @param {*} event 
   */
  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  /**
   * Event handler for renaming a directory
   */
  handleRenameDirectory() {
    const pageArray = [...this.state.currentPath];
    const oldName = pageArray.pop();
    const newDirTree = JSON.parse(JSON.stringify(this.state.dirTree));
    const parent = this.getPage(pageArray, newDirTree, 0);

    parent.directories[this.state.dirName] = parent.directories[oldName];
    delete parent.directories[oldName]
    // const from = [];
    // const to = [];
    // this.renameDirectory(parent.directories[this.state.dirName], this.state.dirName, from, to);

    this.props.onUpdate(newDirTree);
    this.setState({
      dirTree: newDirTree,
      currentPath: [...pageArray, this.state.dirName],
      currentPage: parent.directories[this.state.dirName],
      dirName: '',
      showInput: false
    })
  }

  handleDeletePage() {
    const newDirTree = JSON.parse(JSON.stringify(this.state.dirTree));
    const directoryArray = [...this.state.currentPath];

    if (directoryArray === []) {
      alert('Root directory cannot be deleted.')
    }

    const pageName = directoryArray.pop();
    const parent = this.getPage(directoryArray, newDirTree, 0);

    // TODO: send flattened delete array to check if mongo needs to delete anything
    // const child = parent.directories[pageName];
    // const flatten = (page) => {
    //   Object.entries(page.directories).map(([key, item]) => flatten(item));
    // }
    // flatten(child);

    // TODO: offer option to merge child subdirectories to parent
    const copy = { ...parent.directories };
    // TODO: change mutations in this file to use fp via filter and Object.entries
    delete copy[pageName];
    parent.directories = copy;
    this.props.onUpdate(newDirTree);
    console.log(directoryArray)
    this.setState({
      dirTree: newDirTree,
      currentPage: parent,
      currentPath: directoryArray
    })
  }

  // TODO: add props dirTree={name:"", directory:"", id:number, directories:[]}
  // root page should not be renamed, since directory.root is hardcoded.
  render() {
    const { classes } = this.props;
    // should only have 1 root element for object.keys[0] to work
    return (
      <div>
        <Fab
          className={classes.controlFAB}
          onClick={() => this.setState({
            showDirectory: true,
            currentPage: this.props.dirTree,
            currentPath: [],
            ...this.props.getState()
          })}>
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
              expanded={this.state.expanded}
              // onNodeSelect={this.handleSelectPage}
              onNodeToggle={(event, nodeIds) => this.setState({ expanded: nodeIds })}
              className={classes.treeView}
            >
              {this.renderTree(this.state.dirTree, "root", classes, [])}
            </TreeView>
            <TextField
              id="dirName"
              label="directory name"
              name="dirName"
              value={this.state.dirName}
              margin="normal"
              variant="outlined"
              onChange={this.handleChange}
              className={this.state.showInput ? classes.textField : classes.hide}
            />
            <Fab
              variant="extended"
              onClick={(event) => this.setState({ showInput: true, inputMode: CREATE })}
              className={!this.state.showInput || this.state.inputMode !== CREATE ? classes.controlFAB : classes.hide}>
              <FaPlus />
              New page
            </Fab>
            <Fab
              variant="extended"
              onClick={(event) => this.setState({ showInput: true, inputMode: RENAME })}
              className={!this.state.showInput || this.state.inputMode !== RENAME ? classes.controlFAB : classes.hide}>
              <FaPlus />
              Rename page
            </Fab>
            <Fab
              variant="extended"
              onClick={(event) => this.handleCreatePage(this.state.dirName)}
              className={this.state.showInput && this.state.inputMode === CREATE ? classes.controlFAB : classes.hide}>
              Create
            </Fab>
            <Fab
              variant="extended"
              onClick={(event) => this.handleRenameDirectory(this.state.dirName)}
              className={this.state.showInput && this.state.inputMode === RENAME ? classes.controlFAB : classes.hide}>
              Rename
            </Fab>
            <Fab
              variant="extended"
              onClick={this.handleDeletePage}>
              Delete page
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