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
      currPage: "",
      showInput: false,
      dirTree: this.props.dirTree,
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

  // TODO: can combine with other directory tree traversals to imporve code reuse
  /**
   * Auxillary function to insert an empty page into a directory tree
   * 
   * @param {[map]} pageArray the array of directories to be traversed
   * @param {*} dirTree the current directory
   * @param {*} index the index of the current durectory in pageArray
   * @param {*} fullDir the full directory string
   * @returns {boolean} whether the insert was successful
   */
  insertPage(pageArray, dirTree, index, fullDir) {
    if (index >= pageArray.length - 1) {
      if (dirTree.pages[pageArray[index]] !== undefined) return false;
      dirTree.pages[pageArray[index]] = {
        directory: fullDir,
        id: undefined,
        pages: {}
      }
      return true;
    }
    else {
      return this.insertPage(pageArray, dirTree.pages[pageArray[index]], index + 1, fullDir);
    }
  }

  /**
   * Event handler to create a new page
   * 
   * @param {string} newName the name of the new page
   */
  handleCreatePage(newName) {
    const newDirectory = `${this.state.currPage}/${newName}`;
    const newDirTree = JSON.parse(JSON.stringify(this.state.dirTree));
    const insertSuccess = this.insertPage(newDirectory.split("/"), newDirTree, 1, newDirectory, newDirectory);
    console.log(`directory created successfully: ${insertSuccess}`);
    this.props.onUpdate(newDirTree, [], newName, newDirectory);
    this.setState({
      dirTree: newDirTree,
      showInput: false,
    })
  }

  /**
   * Event handler to update portfolio preview on directory change
   * @param {boolean}} save whether the user wishes to change the view to the selected directory
   */
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

  /**
   * Generic event handler for updating state via componenent name
   * @param {*} event 
   */
  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  getParentPage(pageArray, dirTree, index) {
    if (index === pageArray.length - 1) {
      return dirTree
    }
    else {
      return this.getParentPage(pageArray, dirTree.pages[pageArray[index]], index + 1);
    }
  }

  handleRenameDirectory() {
    // this.state.dirName
    console.log(this.state.currPage)

    const pageArray = this.state.currPage.split('/');
    const oldName = pageArray[pageArray.length - 1];
    const newDirTree = JSON.parse(JSON.stringify(this.state.dirTree));
    let ptr = newDirTree;
    for (let index = 1; index < pageArray.length - 1; index++) {
      ptr = ptr.pages[pageArray[index]]
    }

    console.log(oldName);
    ptr.pages[this.state.dirName] = ptr.pages[oldName];
    delete ptr.pages[oldName]
    const from = [];
    const to = [];
    this.renameDirectory(ptr.pages[this.state.dirName], this.state.dirName, from, to);

    this.props.onUpdate(ptr);
    this.setState({
      dirTree: newDirTree,
      showInput: false
    })
  }

  renameDirectory(dirTree, newDirectory, from, to) {
    from.push(dirTree.directory);
    to.push(newDirectory);
    dirTree.directory = newDirectory;
    Object.entries(dirTree.pages).map(([key, item]) => this.renameDirectory(item, `${newDirectory}/${key}`));
  }

  handleDeletePage() {
    const newDirTree = JSON.parse(JSON.stringify(this.state.dirTree));
    const directoryArray = this.state.currPage.split("/");
    if (directoryArray === []) {
      console.log('Root directory cannot be deleted.')
    }
    const parent = this.getParentPage(directoryArray, newDirTree, 1);

    const child = parent.pages[directoryArray[directoryArray.length - 1]];
    const deleteArray = [];
    const flatten = (page) => {
      deleteArray.push(page.directory);
      Object.entries(page.pages).map(([key, item]) => flatten(item));
    }
    flatten(child);
    // TODO: pass flattened array to portfolio handler

    // TODO: offer option to merge child subdirectories to parent
    // if (child.pages !== []) { }
    const copy = { ...parent.pages };
    console.log(parent);
    delete copy[directoryArray[directoryArray.length - 1]];
    parent.pages = copy;
    this.setState({
      dirTree: newDirTree,
      currPage: parent.directory
    })
    // TODO: Update portfolio state.
  }

  // TODO: add props dirTree={name:"", directory:"", id:number, pages:[]}
  // root page should not be renamed, since directory.root is hardcoded.
  render() {
    const { classes } = this.props;
    // should only have 1 root element for object.keys[0] to work
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
              expanded={this.state.expanded}
              onNodeSelect={this.handleSelectPage}
              onNodeToggle={(event, nodeIds) => this.setState({ expanded: nodeIds })}
              className={classes.treeView}
            >
              {this.renderTree(this.state.dirTree, "root")}
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