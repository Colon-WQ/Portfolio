import React, { Component } from 'react'
import { connect } from 'react-redux'
import { repopulate_state } from '../actions/LoginAction'
import axios from 'axios'
import { withStyles } from '@material-ui/core/styles'
import { Button, IconButton, TextField, Typography, CssBaseline, Modal } from '@material-ui/core';
import { GrFormClose } from "react-icons/gr";


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
        justifyContent: 'center',
        alignItems: 'center',
        padding: '5%',
        textAlign: 'center',
        backgroundColor: '#444444',
        opacity: '90%'
    },
    floating: {
        margin: 0,
        top: 'auto',
        left: 'auto',
        bottom: '8%',
        right: '5%',
        position: 'fixed',
        textAlign: 'center'
    },
    categoryDiv: {
      margin: '1vw'
    },
    imgPreview: {
      width: '5vw',
      height: '5vw'
    },
    sectionDiv: {
      display: 'flex',
      flexDirection: 'row'
    },
    div: {
      padding: '10px'
    }
})

/**
 * The dashboard logged in users will use to navigate the page.
 * 
 * @component
 * @example
 * const fields = {
 *   width: "50%", 
 *   height: "50%", 
 *   fonts: {titleFont: "title font"},
 *   colours: {primary: "#FF0000", secondary: "#FFFF00"},
 *   images: {dp: "",bg: ""},
 *   texts: {name: "",status: ""},
 *   sections: []
 * }
 * const info = {
 *   fonts: {titleFont: {label: "title font"}},
 *   colours: {primary: {label: "primary"},secondary: {label: "secondary"}},
 *   images: {dp: {label: "Your portrait photo", allowColour: false}, bg: {label: "Entry background", allowColour: true}},
 *   texts: {name: {label: "Your full name"}, status: {label: "your current position"}},
 *   sections: {label: "Add a work experience", 
 *     entryFormat: { 
 *       images: {picture:{label: "Add a photo"}}, 
 *       texts: {title: {label: "Add a title"}, body: {label: "Describe your experience"}}
 *     },
 *     defaultEntry: {images: {picture:{value: ""}},texts: {title: {value: ""},body: {value: ""}}},
 *     enabled: true
 *   }
 * }
 * return (<EntryEditor fields={fields} info={info} onChange=true/>)
 */
class EntryEditor extends Component {
    // TODO: check if componenetDidMount can overwrite constructor
    
    /**
     * Populates state with fields passed in as attribute fields.
     * @constructor
     */
    constructor(props) {
        super(props);
        this.state = {
            ...this.props.fields,
        }
        this.handleCreateEntry = this.handleCreateEntry.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleImageUpload = this.handleImageUpload.bind(this);
        this.handleEditSection = this.handleEditSection.bind(this);
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
     * Event handler for text fields. 
     * Text fields should be named after their keys in the state.
     * 
     * @property {Function} handleChange
     * @param {*} event 
     * @return void
     * @memberof EntryEditor
     */
    handleChange(event, category) {
      if (category === "") {
        this.setState({
          [event.target.name]: event.target.value
        });
      } else {
        const originalCat = {...this.state[category]};
        originalCat[event.target.name] = event.target.value;
        this.setState({
          [category]: originalCat
        });
      }
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

    /**
     * Event handler for entry addition. 
     * Entry will be given default fields specified in the info attribute.
     * 
     * @property {Function} handleCreateEntry
     * @return void
     * @memberof EntryEditor
     */
    handleCreateEntry() {
        this.setState({sections: [...this.state.sections, this.props.info.sections.defaultEntry]});
    }

    handleEditSection(event, index) {
      const newSections = [...this.state.sections];
      newSections[index][event.target.name] = event.target.value;
      this.setState({
        sections: newSections
      });
    }

    render() {
        const { classes } = this.props;
        // TODO: change name/id to field-name-id to avoid collision i.e. colours-primary-0
        return (
          // populate state with default values
            <Modal className = {classes.root}
            // open always set to true, open/close logic handled by portfolio
              open={true}
              // TODO: add onClose save logic
              onClose={() => this.props.onClose(this.state, true)}
              aria-labelledby="Entry editor"
              aria-describedby="Edit your entry fields here"
            >
              <div className={classes.root}>
                <Typography component="h3" variant="h3">Entry editor</Typography>
                <div className={classes.sectionDiv}>
                  <div className={classes.categoryDiv}>
                    <TextField 
                      id="width"
                      label="width"
                      name="width"
                      value={this.state.width}
                      margin="normal"
                      variant="outlined"
                      onChange={(event) => this.handleChange(event, "")}
                      />
                    <TextField 
                      id="height"
                      label="height"
                      name="height"
                      value={this.state.height}
                      margin="normal"
                      variant="outlined"
                      onChange={(event) => this.handleChange(event, "")}
                      />
                  </div>
                  <div className={classes.categoryDiv}>
                    {Object.entries(this.state.fonts).map(([key, item]) => {
                      return (<TextField
                        name={key}
                        id={key}
                        label={this.props.info.fonts[key].label}
                        value={item}
                        margin="normal"
                        variant="outlined"
                        onChange={(event) => this.handleChange(event, "fonts")}/>)
                    })}
                  </div>
                  <div className={classes.categoryDiv}>
                    {Object.entries(this.state.colours).map(([key, item]) => {
                      return (
                        <div>
                          {/* Preview icon that changes according to selected colour */}
                          {/* <Button id="colourPreview"/> */}
                          <TextField
                            name={key}
                            id={key}
                            label={this.props.info.colours[key].label}
                            defaultValue={item}
                            margin="normal"
                            variant="outlined"
                            onChange={(event) => this.handleChange(event, "colours")}
                          />
                        </div>
                        )
                    })}
                  </div>
                </div>
                <div className={classes.sectionDiv}>
                  <div className={classes.categoryDiv}>
                    {Object.entries(this.state.images).map(([key, item]) => {
                      return (
                        <div>
                          <Button onClick={this.handleImageUpload}>
                            <img src={item} className={classes.imgPreview}/>
                          </Button>
                          <Typography>
                            {this.props.info.images[key].label}
                          </Typography>
                        </div>
                        );
                    })}
                  </div>
                  <div className={classes.categoryDiv}>
                    {Object.entries(this.state.texts).map(([key, item]) => {
                      return (
                        <div>
                          {/* Preview icon that changes according to selected colour */}
                          {/* <Button id="colourPreview"/> */}
                          <TextField
                            name={key}
                            id={key}
                            label={this.props.info.texts[key].label}
                            defaultValue={item}
                            margin="normal"
                            variant="outlined"
                            onChange={(event) => this.handleChange(event, "texts")}
                          />
                        </div>
                        )
                    })}
                  </div>
                </div>
                {this.props.info.sections.enabled 
                ? <div className={classes.entryDiv}>
                  {this.state.sections.map((entryObj, index) => {
                    return (
                      <div>
                        <div className={classes.imgDiv}>
                          {Object.entries(entryObj.images).map(([key, item]) => {
                            return (
                              <div>
                                {/* TODO: implement different logic */}
                                <Button onClick={this.handleImageUpload}>
                                  <img src={item} className={classes.imgPreview}/>
                                </Button>
                                <Typography>
                                  {this.props.info.sections.entryFormat.images[key].label}
                                </Typography>
                              </div>
                              );
                          })}
                        </div>
                        <div className={classes.textDiv}>
                          {Object.entries(entryObj.texts).map(([key, item]) => {
                            // TODO: make maxRow field in info?
                            return (
                              <div>
                                <TextField
                                  name={key}
                                  id={key}
                                  label={this.props.info.sections.entryFormat.texts[key].label}
                                  defaultValue={item}
                                  margin="normal"
                                  variant="outlined"
                                  onChange={(event) => this.handleEditSection(event, "")}
                                  multiline
                                  rowsMax={3}
                                />
                              </div>
                              );
                          })}
                        </div>
                      </div>
                      )
                  })}
                  <IconButton onClick={this.handleCreateEntry}>+</IconButton>
                </div>
                : null}
              </div>
            </Modal>
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