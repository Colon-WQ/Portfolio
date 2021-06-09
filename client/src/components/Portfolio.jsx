import React, { Component } from 'react';
import { connect } from 'react-redux';
import { repopulate_state } from '../actions/LoginAction';
import { saveCurrentWork, saveCurrentWorkToLocal, toggleUnsavedWork } from '../actions/PortfolioAction.js';
import { withStyles } from '@material-ui/core/styles'
import { Fab } from '@material-ui/core';
import { FaSave, FaTrash } from "react-icons/fa";
import { Base64 } from 'js-base64';
import ReactDOMServer from 'react-dom/server';
import { ServerStyleSheets } from '@material-ui/core/styles'
import EntryEditor from './EntryEditor';
import { templates } from '../templates/Templates';
import TemplateSelector from './TemplateSelector';
import Publish from './Publish';
import axios from 'axios';
import DirectoryManager from './DirectoryManager';
import { Prompt, withRouter } from 'react-router-dom';

/**
 * @file Portfolio component representing a user created portfolio
 * 
 * @author Chuan Hao
 * 
 * @see Portfolio
 */

/**
 * Style generator to dynamically adjust styles based on theme provided
 * 
 * @memberof Portfolio
 * @param {Object} theme 
 */
const styles = (theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'start',
    alignItems: 'center',
    paddingTop: '7%',
  },
  entryDiv: {
    position: 'relative'
  },
  delFAB: {
    position: 'absolute',
    marginTop: '5vw',
    marginLeft: '2vw'
  },
  controlFAB: {
    position: 'static',
    marginRight: '0.5vw',
    marginBottom: '0.5vw'
  },
  staticDiv: {
    position: 'fixed',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    bottom: "5%",
    right: "5%",
    top: "auto",
    left: "auto"
  }
})

/**
 * The portfolio component used for rendering previews and compiling for publishing.
 * 
 * 
 * @component
 */
class Portfolio extends Component {
  /**
   * @constructor
   */
  constructor(props) {
    super(props);
    this.state = {
      editMode: true,
      portfolio_id: undefined,
      name: "",
      pages: [{
        directory: "",
        entries: []
      }],
      currentPage: 0,
      pushables: [],
      dirTree: {
        directory: "",
        id: "root_mongo_id",
        pages:
          {}
      },
      isTimerExist: false
    }
    this.handleEditorClose = this.handleEditorClose.bind(this);
    this.handleCreateFile = this.handleCreateFile.bind(this);
    this.handleProduction = this.handleProduction.bind(this);
    this.handleSelector = this.handleSelector.bind(this);
    this.handleUpdatePages = this.handleUpdatePages.bind(this);
    this.handleDirectory = this.handleDirectory.bind(this);
    this.handleSavePortfolio = this.handleSavePortfolio.bind(this);
  }

  /**
   * Attempts to fetch user details and logged in status from localStorage after component is rendered.
   * 
   * @return void
   * @memberof Portfolio
   */
  async componentDidMount() {
    if (!this.props.loggedIn) {
      const userLocalStorageItem = await JSON.parse(window.localStorage.getItem(process.env.REACT_APP_USER_LOCALSTORAGE));
      const portfolioLocalStorageItem = await JSON.parse(window.localStorage.getItem(process.env.REACT_APP_AUTOSAVE_LOCALSTORAGE));
      await this.props.repopulate_state(userLocalStorageItem);
      await this.props.saveCurrentWork(portfolioLocalStorageItem);
    }

    //The rationale behind using this.state.name as the check is that name would be set before the user enters
    if (this.props.loggedIn) {
      if (this.props.currentPortfolio !== null) {
        //Need to set the relevant _id, name, pages if portfolio exists.
        //Redux state currentPortfolio is set such that if its not null, it will have name.
        this.setState({
          name: this.props.currentPortfolio.name
        })

        if (this.props.currentPortfolio._id !== undefined && this.props.currentPortfolio.pages !== undefined) {
          this.setState({
            portfolio_id: this.props.currentPortfolio._id,
            pages: this.props.currentPortfolio.pages
          })
        }
      }
    }
  }

  /**
   * componentDidUpdate checks when isUnsaved is changed and triggers a timer to autosave so that we will not save
   * while the user is actively editing his Portfolio.
   * 
   * First sets isTimerExist in state to true
   * 
   * After timer is up, saves current portfolio to localStorage and redux state. 
   * 
   * The timer is now set to 3s after any edit is done.
   * 
   * @return void
   * @memberof Portfolio
   */
  // componentDidUpdate() {
  //   if (this.props.isUnsaved && !this.state.isTimerExist) {
  //     setTimeout(async () => {
  //       console.log("Autosaving")

  //       await this.handleSavePortfolio();

  //       // this.props.saveCurrentWorkToLocal({
  //       //   _id: this.state.portfolio_id,
  //       //   name: this.state.name,
  //       //   pages: this.state.pages
  //       // });
  //       this.props.toggleUnsavedWork(false);

  //       //Sets isTimerExist to false after saving so new timers can be set.
  //       this.setState({
  //         isTimerExist: false
  //       })
  //     }, 3000);

  //     //Sets isTimerExist to true so we don't queue multiple unnecessary save timers
  //     this.setState({
  //       isTimerExist: true
  //     });
  //   }
  // }



  /**
   * Function to enter entries based on the entry's type and template style.
   * 
   * @param {*} entryFields 
   * @param {number} index 
   * @returns void
   * @memberof Portfolio
   */
  renderEntry(entryFields, index) {
    return templates[entryFields.type][entryFields.style].component(entryFields, index);
  }

  /**
   * Event handler to open/close the template selector and update states if necessary
   * 
   * @param {*} selection - the fields to update, or null if no changes are needed
   */
  handleSelector(selection) {
    const entryType = selection.type;
    const entryStyle = selection.style;
    const fieldsCopy = JSON.parse(JSON.stringify(templates[entryType][entryStyle].defaultField))
    const newEntry = {
      type: entryType,
      style: entryStyle,
      ...fieldsCopy
    };
    const newPages = [...this.state.pages];
    newPages[this.state.currentPage].entries =
      [...this.state.pages[this.state.currentPage].entries, newEntry];
    this.setState({
      pages: newPages,
    })

    //triggers Autosave
    this.props.toggleUnsavedWork(true);
  }

  /**
   * Function to update the entry based on the styles provided by the user.
   * 
   * @param {*} fields
   * @param {boolean} changed - Whether the fields have been changed/ if the user intends to save the changes.
   */
  handleEditorClose(fields, changed, index) {
    if (changed) {
      const newPages = [...this.state.pages];
      const entries = [...this.state.pages[this.state.currentPage].entries];
      entries[index] = fields;
      newPages[this.state.currentPage].entries = entries;
      this.setState({
        pages: newPages
      })

      //triggers Autosave
      this.props.toggleUnsavedWork(true);
    } else {
      this.forceUpdate();
    }
  }

  // TODO: publish component check file empty before load?
  /**
   * A function to generate the necessary html/css/js files for a single page.
   * 
   * @param {*} entries 
   * @param {string} directory - The directory/route to the page as defined by the user.
   * @returns {(Map|Array)} An array of maps containing the relative paths to each file and their contents.
   * 
   */
  handleCreateFile(entries, directory) {
    const images = [];
    const copy = JSON.parse(JSON.stringify(entries));
    for (let idx = 0; idx < copy.length; idx++) {
      let dupeEntry = copy[idx];
      Object.entries(dupeEntry.images).map(([key, item]) => {
        if (item.startsWith('data:image/')) {
          const split = item.split(',');
          const fileType = split[0].substring(11, split[0].indexOf(';'));
          const baseContent = split[1];
          console.log(baseContent);
          const imgDir = `assets/${key}${idx}.${fileType}`;
          images.push({
            file: `${directory}${imgDir}`,
            contents: baseContent
          });
          copy[idx].images[key] = imgDir;
        }
        // copy.images[key] = `${directory}/${key}.jpg`
      })
      for (let s_idx = 0; s_idx < dupeEntry.sections.length; s_idx++) {
        let dupeSection = dupeEntry.sections[s_idx];
        Object.entries(dupeSection.images).map(([key, item]) => {
          if (item.startsWith('data:image/')) {
            const split = item.split(',');
            const fileType = split[0].substring(11, split[0].indexOf(';'));
            const baseContent = split[1];
            const size = baseContent.length * 3 / 4 - baseContent.split('=')
            console.log(baseContent);
            const imgDir = `assets/${key}${idx}_section${s_idx}.${fileType}`;
            images.push({
              file: `${directory}${imgDir}`,
              contents: baseContent
            });
            copy[idx].sections[s_idx].images[key] = imgDir;
          }
          // copy.images[key] = `${directory}/${key}.jpg`
        })
      }
    }

    const sheets = new ServerStyleSheets();
    // TODO: test renderToStaticMarkup
    const rawHTML = ReactDOMServer.renderToString(sheets.collect(
      <div style={{ display: "flex", flexDirection: "column" }}>
        {copy.map((entry, index) => this.renderEntry(entry))}
      </div>));
    // TODO: add title
    const html = Base64.encode(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <meta http-equiv="X-UA-Compatible" content="ie=edge">
                <link href="styles.css" rel="stylesheet">
                <script defer src="script.js"></script>
                <title>Welcome</title>
            </head>
            <body>
            ${rawHTML}
            </body>`);
    const css = Base64.encode(sheets.toString());
    const js = Base64.encode(copy
      .map((entry, index) => templates[entry.type][entry.style].script(index))
      .filter(Boolean).join('\n'));

    const files = [
      ...images,
      {
        file: `${directory}scripts.js`,
        contents: js
      },
      {
        file: `${directory}index.html`,
        contents: html
      },
      {
        file: `${directory}styles.css`,
        contents: css
      }
    ]
    // TODO: remove for deployment
    files.map((value) => alert(`file: ${value.file};\n${Base64.decode(value.contents)}`));
    return files;
  }

  /**
   * Handles saving portfolio to mongoDB
   * 
   * @returns void
   * @memberof Portfolio
   */
  async handleSavePortfolio() {
    await axios({
      method: "PUT",
      url: process.env.REACT_APP_BACKEND + "/portfolio/upsert",
      withCredentials: true,
      data: {
        user: {
          id: this.props.id,
          name: this.props.name,
          avatar: this.props.avatar_url,
          gravatar_id: this.props.gravatar_id
        },
        portfolio: {
          _id: this.state.portfolio_id,
          name: this.state.name,
          pages: this.state.pages
        }
      }
    }).then(async res => {
      console.log(res.data.message);
      //Need to set the id first to fetch it after this.
      this.setState({
        portfolio_id: res.data._id
      })

      //If saving/updating is successful, need to fetch from db to get the ObjectIds created by mongoose for the portfolio, pages and entries.
      //WARNING: Could be a source of poor performance. Might be a better way to do this.
      await axios({
        method: "GET",
        url: process.env.REACT_APP_BACKEND + "/portfolio/" + this.state.portfolio_id,
        withCredentials: true
      }).then(res => {
        console.log("_id updated");
        this.props.saveCurrentWorkToLocal(res.data.portfolio);
        //There is no need to set the _id for portfolio since we already did it as a prerequisite for this step.
        //Name is also set.
        this.setState({
          pages: res.data.portfolio.pages
        });
      }).catch(err => {
        if (err.response) {
          console.log(err.response.data);
        } else {
          console.log(err.message);
        }

        //If code comes to here, it means _id is not fetched after save is successful. We bring the user
        //back to dashboard to force him to reopen and fetch the portfolio again.
        this.props.history.push("/dashboard");
      })

    }).catch(err => {
      if (err.response) {
        console.log(err.response.data);
      } else {
        console.log(err.message);
      }
    })
  }

  /**
   * A function to generate all files needed to be pushed to github.
   * @returns {(Map|Array)} An array of maps each containing the relative paths to each file and their contents.
   * 
   */
  async handleProduction() {
    //this saves the portfolio to mongoDB
    await this.handleSavePortfolio();

    let pushableArray = [];

    for (const page of this.state.pages) {
      const fileArray = this.handleCreateFile(page.entries, page.directory);
      console.log("fileArray is: ")
      console.log(fileArray);
      for (let obj of fileArray) {
        pushableArray.push({
          fileName: obj.file,
          fileContent: obj.contents
        })
      }
    }
    this.setState({
      pushables: pushableArray
    })
  }

  /**
   * A function to delete entries from a portfolio
   * 
   * @param {number} index the index of the entry to be deleted
   * @returns void
   * @memberof Portfolio
   */
  handleDeleteEntry(index) {
    const newPages = [...this.state.pages];
    // TODO: mark entry to be deleted from mongo. NO NEED: The upsert basically wipes everything and then adds all the entries back in the same order
    //that was given to the route.
    newPages[this.state.currentPage].entries =
      this.state.pages[this.state.currentPage].entries.filter(
        (item, filterIndex) => (filterIndex !== index)
      );
    this.setState({
      pages: newPages
    });

    //triggers Autosave
    this.props.toggleUnsavedWork(true);
  }

  handleUpdatePages(newDirTree, newPageName, newPageDirectory) {
    const newPages = [...this.state.pages, {
      directory: newPageDirectory,
      entries: [],
      name: newPageName,
      id: undefined
    }];

    this.state.pages = newPages;
    this.state.dirTree = newDirTree;
    console.log(this.state.pages);

    //Triggers autosave
    this.props.toggleUnsavedWork(true);
  }

  handleDirectory(directory) {
    if (directory !== undefined) {
      for (let index = 0; index < this.state.pages.length; index++) {
        if (this.state.pages[index].directory === directory) this.state.currentPage = index;
        console.log(this.state.currentPage);
        console.log(this.state.pages)
      }
    }
    this.forceUpdate();
  }

  // TODO: move editor components and logic into component files
  render() {
    const { classes } = this.props;

    return (
      <div style={{ display: "flex", flexDirection: "column" }}>
        <Prompt
          when={this.props.isUnsaved}
          message={JSON.stringify({
            message: "Are you sure you want to leave? You have unsaved work.",
            portfolio: {
              _id: this.state.portfolio_id,
              name: this.state.name,
              pages: this.state.pages
            },
            user: {
              id: this.props.id,
              name: this.props.name,
              avatar: this.props.avatar_url,
              gravatar_id: this.props.gravatar_id
            }
          })}
        />

        {this.state.pages[this.state.currentPage].entries.map((entry, index) => {
          // Key MUST be unique -> component will be reinitialized if key is different.
          return (<div style={{ display: "flex", flexDirection: "row" }}>
            <EntryEditor
              fields={entry}
              info={templates[entry.type][entry.style].info}
              onClose={(data, changed) => {
                this.handleEditorClose(data, changed, index);
              }}
              key={`${this.state.currentPage}-${index}-${entry.type}-${entry.style}`}
            />
            <Fab
              className={classes.delFAB}
              onClick={() => this.handleDeleteEntry(index)}>
              <FaTrash />
            </Fab>
            {this.renderEntry(entry)}
          </div>);
        })}
        <div className={classes.staticDiv}>
          <Fab
            className={classes.controlFAB}
            onClick={() => console.log(this.handleProduction())}>
            <FaSave />
          </Fab>
          <TemplateSelector
            onClose={this.handleSelector}
          />
          <DirectoryManager
            onClose={this.handleDirectory}
            dirTree={this.state.dirTree}
            onCreate={this.handleUpdatePages}
          />
          <Publish pushables={this.state.pushables} />
        </div>
      </div>);
  }
}

/**
 * Function that maps variables from Redux Store to Home component's props.
 *
 * @param {Object} state - Redux Store
 * @memberof Portfolio
 */
const mapStateToProps = state => ({
  loggedIn: state.login.loggedIn,
  name: state.login.name,
  id: state.login.id,
  avatar_url: state.login.avatar_url,
  gravatar_id: state.login.gravatar_id,
  currentPortfolio: state.portfolio.currentPortfolio,
  isUnsaved: state.portfolio.isUnsaved
})

/** 
 * Provides action creators to Home component's props.
 * 
 * @type {Object.<Function>} 
 * @memberof Portfolio
 */
const mapDispatchToProps = {
  repopulate_state,
  saveCurrentWork,
  saveCurrentWorkToLocal,
  toggleUnsavedWork
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(withRouter(Portfolio)))