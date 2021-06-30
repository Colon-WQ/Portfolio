import React, { Component } from 'react';
import { connect } from 'react-redux';
import { repopulate_state } from '../actions/LoginAction';
import { saveCurrentWork, saveCurrentWorkToLocal, toggleUnsavedWork } from '../actions/PortfolioAction.js';
import { ThemeProvider, withStyles } from '@material-ui/core/styles'
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
import { theme } from '../styles/styles';
import html2canvas from 'html2canvas';
import FormData from 'form-data';
import { handleErrors } from '../handlers/errorHandler';


import { create } from 'jss';
import { jssPreset } from '@material-ui/styles';
const jss = create().setup({ ...jssPreset(), Renderer: null });

/**
 * @file Portfolio component representing a user created portfolio
 * 
 * @author Chuan Hao
 * @author Chen En
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
    flexDirection: 'column'
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
  },
  entryEditorDiv: {
    display: "flex",
    flexDirection: "row"
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
      pages: {
        directory: 'root',
        entries: [],
        directories: {},
        id: 'root_mongo_id'
      },
      currentPage: undefined,
      currentPath: [],
      // dirTree: {
      //   directory: 'root',
      //   id: "root_mongo_id",
      //   pages:
      //     {}
      // },
      isTimerExist: false
    }
    this.state.currentPage = this.state.pages
    this.handleEditorClose = this.handleEditorClose.bind(this);
    this.handleCreateFile = this.handleCreateFile.bind(this);
    this.handleProduction = this.handleProduction.bind(this);
    this.handleSelector = this.handleSelector.bind(this);
    this.handleUpdatePages = this.handleUpdatePages.bind(this);
    this.handleDirectory = this.handleDirectory.bind(this);
    this.handleSavePortfolio = this.handleSavePortfolio.bind(this);
    this.handleUploadPreview = this.handleUploadPreview.bind(this);
    this.handleSaveLocalPortfolio = this.handleSaveLocalPortfolio.bind(this);
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
      console.log(userLocalStorageItem)
      if (userLocalStorageItem !== null) {
        const portfolioLocalStorageItem = JSON.parse(window.localStorage.getItem(process.env.REACT_APP_AUTOSAVE_LOCALSTORAGE));
        this.props.repopulate_state(userLocalStorageItem);
        this.props.saveCurrentWork(portfolioLocalStorageItem);
      }
    }

    //currentPortfolio should be set with an object before reaching this page and it would have a name.
    if (this.props.currentPortfolio !== null) {
      //Need to set the relevant _id, name, pages if portfolio exists.
      //Redux state currentPortfolio is set such that if its not null, it will have name.
      this.setState({
        name: this.props.currentPortfolio.name
      })

      if (this.props.currentPortfolio._id !== undefined && this.props.currentPortfolio.pages !== undefined) {
        this.setState({
          portfolio_id: this.props.currentPortfolio._id,
          pages: this.props.currentPortfolio.pages,
          currentPage: this.props.currentPortfolio.pages
        })
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
   * The timer is now set to 30s after any edit is done.
   * 
   * @return void
   * @memberof Portfolio
   */
  componentDidUpdate() {
    
    if (this.props.isUnsaved && !this.state.isTimerExist) {
      setTimeout(async () => {

        if (this.props.loggedIn) {
          console.log("Autosaving")
          await this.handleSavePortfolio();
        } else {
          await this.handleSaveLocalPortfolio();
        }

        this.props.toggleUnsavedWork(false);

        //Sets isTimerExist to false after saving so new timers can be set.
        this.setState({
          isTimerExist: false
        })
      }, 30000);

      //Sets isTimerExist to true so we don't queue multiple unnecessary save timers
      this.setState({
        isTimerExist: true
      });
    }
  }

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

  traverseDirectory(pages, pathArray) {
    let ptr = pages;
    for (let index = 0; index < pathArray.length; index++) {
      ptr = ptr.directories[pathArray[index]];
    }
    return ptr;
  }

  /**
   * Event handler to open/close the template selector and update states if necessary
   * 
   * @param {Object} selection - the fields to update, or null if no changes are needed
   */
  handleSelector(selection) {
    const entryType = selection.type;
    const entryStyle = selection.style;
    const fieldsCopy = JSON.parse(JSON.stringify(templates[entryType][entryStyle].defaultField));
    const newEntry = {
      type: entryType,
      style: entryStyle,
      ...fieldsCopy
    };
    const newPages = { ...this.state.pages };
    const currentPage = this.traverseDirectory(newPages, this.state.currentPath);
    currentPage.entries =
      [...this.state.currentPage.entries, newEntry];
    this.setState({
      pages: newPages,
      currentPage: currentPage
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
      const newPages = { ...this.state.pages };
      const entries = [...this.state.currentPage.entries];
      entries[index] = fields;
      const currentPage = this.traverseDirectory(newPages, this.state.currentPath)
      currentPage.entries = entries;
      this.setState({
        pages: newPages,
        currentPage: currentPage
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
  handleCreateFile(page, prepend) {
    // Allow users to create empty pages so they can create their own pages
    const entries = page.entries;
    console.log(page);
    if (entries === []) return [];

    // removes 'root' placeholder
    console.log(page.directory)
    const directory = `${prepend}${page.directory === 'root' ? '' : page.directory + "/"}`;
    const images = [];
    console.log(entries);

    const copy = JSON.parse(JSON.stringify(entries));
    for (let idx = 0; idx < copy.length; idx++) {
      let dupeEntry = copy[idx];
      Object.entries(dupeEntry.images).map(([key, item]) => {
        if (item.format === 'image' && item.src.startsWith('data:image/')) {
          const split = item.src.split(',');
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
          if (item.format === 'image' && item.src.startsWith('data:image/')) {
            const split = item.src.split(',');
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


    const sheets = new ServerStyleSheets({jss});

    // TODO: test renderToStaticMarkup
    //NOTE: sheets.collect will look for mui styling in the provided component.
    //We also need to wrap that component with the theme we are using so that the style can reference it properly
    //Suspect that because certain styles are missing, their defaults may be injected into our app, resulting in default css styles.
    const rawHTML = ReactDOMServer.renderToString(sheets.collect(
      <ThemeProvider theme={theme}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {copy.map((entry, index) => this.renderEntry(entry))}
        </div>
      </ThemeProvider>
    ));


    // TODO: add title
    // TODO: remove empty files
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

    let files = [
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

    // inefficient code, might be able to optimise
    if (page.directories !== {}) {
      Object.values(page.directories).map((value) => {
        console.log(value);
        const fileArray = this.handleCreateFile(value, directory);
        files = files.concat(fileArray);
      })
    }
    console.log(files);
    return files;
  }

  /**
   * Sends a request to backend to save Portfolio. It then sends a request to fetch the same portfolio from backend, now populated with
   * relevant _ids and other required data and saves it to redux state and localStorage. If this is not possible, the user
   * will be directed to /dashboard so that another attempt can be made to fetch the portfolio from backend.
   * 
   * @returns void
   * @memberof Portfolio
   */
  async handleSavePortfolio() {
    console.log("saving begins");
    console.log(this.state.pages);
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
      }).then(async res => {
        console.log("_id updated");
        console.log(res.data.portfolio);
        this.props.saveCurrentWorkToLocal(res.data.portfolio);
        //There is no need to set the _id for portfolio since we already did it as a prerequisite for this step.
        //Name is also set.
        this.setState({
          pages: res.data.portfolio.pages
        });
        console.log(this.state.pages);

        //After _id is fetched, we then update the preview.
        await this.handleUploadPreview();
      }).catch(err => {
        handleErrors(err, this.props.history);

        //If code comes to here, it means _id is not fetched after save is successful. We bring the user
        //back to dashboard to force him to reopen and fetch the portfolio again.
        this.props.history.push("/dashboard");
      })

    }).catch(err => {
      handleErrors(err, this.props.history);
    })
  }



  /**
   * A function to generate all files needed to be pushed to github.
   * 
   * @returns {(Map|Array)} An array of maps each containing the relative paths to each file and their contents.
   * @memberof Portfolio
   */
  handleProduction() {

    const fileArray = this.handleCreateFile(this.state.pages, '');
    // fileArray.map((value) => alert(`file: ${value.file};\n${Base64.decode(value.contents)}`));
    let renameArray = [];
    fileArray.map((obj) => {
      renameArray.push({
        fileName: obj.file,
        fileContent: obj.contents
      })
    });
    //console.log(renameArray);

    return renameArray;
  }

  /**
   * A function to delete entries from a portfolio
   * 
   * @param {number} index the index of the entry to be deleted
   * @returns void
   * @memberof Portfolio
   */
  handleDeleteEntry(index) {
    const newPages = { ...this.state.pages };
    let ptr = newPages;
    const currentPage = this.traverseDirectory(newPages, this.state.currentPath);
    currentPage.entries =
      this.state.currentPage.entries.filter(
        (item, filterIndex) => (filterIndex !== index)
      );
    this.setState({
      pages: newPages,
      currentPage: currentPage
    });

    //triggers Autosave
    this.props.toggleUnsavedWork(true);
  }

  handleUpdatePages(newDirTree) {
    this.state.pages = newDirTree;
    this.state.currentPage = newDirTree;
    this.state.currentPath = [];

    //Triggers autosave
    this.props.toggleUnsavedWork(true);
  }

  handleDirectory(currentPage, currentPath) {
    if (currentPage !== undefined) {
      this.state.currentPage = currentPage;
      this.state.currentPath = currentPath;
    }
    this.forceUpdate();
  }

  /**
   * renders html element with id "preview" to a canvas and ignores html elements marked with data-html2canvas-ignore="true"
   * that are present within the preview element. The canvas is then converted into a png and a request is made to backend
   * to save the png file under current portfolio with label "preview"
   * 
   * @return void
   * @memberof Portfolio
   */
  async handleUploadPreview() {
    await html2canvas(document.querySelector("#preview"), { backgroundColor: null, useCORS: true })
      .then(canvas => {

        canvas.toBlob(async blob => {
          const bodyFormData = new FormData();
          bodyFormData.append('file', new File([blob], `${this.state.name} preview`, { type: "image/png" }));
          bodyFormData.append('label', "preview");

          await axios({
            method: "GET",
            url: process.env.REACT_APP_BACKEND + "/portfolio/checkExistingImage/" + this.state.portfolio_id,
            withCredentials: true,
            params: {
              label: "preview"
            }
          }).then(async res => {
            if (res.data.isExist) {
              console.log("updating image")
              await axios({
                method: "PUT",
                url: process.env.REACT_APP_BACKEND + "/portfolio/updateImage/" + this.state.portfolio_id,
                withCredentials: true,
                data: bodyFormData,
                headers: { "Content-Type": "multipart/form-data" }
              }).then(res => {
                console.log(res.data.message);
              }).catch(err => {
                handleErrors(err, this.props.history);
              })
            } else {
              console.log("uploading image");
              await axios({
                method: "POST",
                url: process.env.REACT_APP_BACKEND + "/portfolio/uploadImage/" + this.state.portfolio_id,
                withCredentials: true,
                data: bodyFormData,
                headers: { "Content-Type": "multipart/form-data" }
              }).then(res => {
                console.log(res.data.message);
                console.log(res.data.refs);
              }).catch(err => {
                handleErrors(err, this.props.history);
              });
            }
          }).catch(err => {
            handleErrors(err, this.props.history);
          })
        }
        )
      }).catch(err => {
        console.log(err);
      })
  }

  async handleSaveLocalPortfolio() {
    console.log("Autosaving locally");

    //saving current work to localStorage and redux store
    await this.props.saveCurrentWorkToLocal({
      name: this.state.name,
      user: '',
      pages: this.state.pages
    });
  }

  render() {
    const { loggedIn, classes } = this.props;
    return (
      <div className={classes.root}>
        <Prompt
          when={loggedIn && this.props.isUnsaved}
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

        <div id="preview">
          {this.state.currentPage.entries.map((entry, index) => {
            // Key MUST be unique -> component will be reinitialized if key is different.
            return (<div className={classes.entryEditorDiv}>
              <EntryEditor
                fields={entry}
                info={templates[entry.type][entry.style].info}
                onClose={(data, changed) => {
                  this.handleEditorClose(data, changed, index);
                }}
                key={`${this.state.currentPath === []
                  ? 'root'
                  : this.state.currentPath[this.state.currentPath.length - 1]
                  }-${index}-${entry.type}-${entry.style}`}
              />
              <Fab
                data-html2canvas-ignore="true"
                className={classes.delFAB}
                onClick={() => this.handleDeleteEntry(index)}>
                <FaTrash />
              </Fab>
              {this.renderEntry(entry)}
            </div>);
          })}
        </div>
        <div className={classes.staticDiv}>
          <Fab
            variant="extended"
            className={classes.controlFAB}
            onClick={() => loggedIn ? this.handleSavePortfolio() : this.handleSaveLocalPortfolio()}>
            <FaSave />
            save
          </Fab>
          <TemplateSelector
            onClose={this.handleSelector}
          />
          <DirectoryManager
            onClose={this.handleDirectory}
            getState={() => {
              return {
                dirTree: this.state.pages
              }
            }}
            dirTree={this.state.pages}
            onUpdate={this.handleUpdatePages}
          />
          <Publish createPushables={this.handleProduction} portfolioName={this.state.name}/>
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