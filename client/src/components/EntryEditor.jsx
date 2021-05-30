import React, { Component } from 'react'
import { connect } from 'react-redux'
import { repopulate_state } from '../actions/LoginAction'
import axios from 'axios'
import { withStyles } from '@material-ui/core/styles'
import { Button, IconButton, TextField, Typography, CssBaseline, Modal, Icon, Input, InputLabel } from '@material-ui/core';
import { FaPlus, FaTrashAlt, FaChevronLeft, FaChevronRight } from "react-icons/fa";


/**
 * @file EntryEditor component to provide a user interface for users to style their entries
 * 
 * @author Chuan Hao
 * 
 * @see EntryEditor
 */

/**
 * Style generator to dynamically adjust styles based on theme provided
 * 
 * @memberof EntryEditor
 * @param {Object} theme 
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
    modal: {
      overflow: 'scroll',
      display: 'flex',
      flexDirection: 'column',
      padding: '5%',
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
            data: {...this.props.fields},
            currentSection: 0
        }
        this.handleCreateEntry = this.handleCreateEntry.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleImageUpload = this.handleImageUpload.bind(this);
        this.handleEditSectionText = this.handleEditSectionText.bind(this);
        this.handleSectionView = this.handleSectionView.bind(this);
    }

    // TODO: elements read from state instead of props
    // TODO: unbounded mongo models
    /**
     * Attempts to fetch entry details where possible so settings are saved.
     * 
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
        const originalCat = {...this.state.data[category]};
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
     * Event handler for deletion of sub sections.
     * 
     * @param {*} event 
     * @return void
     * @memberof EntryEditor
     */
    handleDeleteSection(event) {
      const spliced = this.state.data.sections.filter((item, filterIndex) => filterIndex !== this.state.currentSection);
      this.setState({
        data: {
          ...this.state.data,
          sections: spliced
        }
      })
      console.log(spliced)
    }

    /**
     * Event handler for entry addition. 
     * Entry will be given default fields specified in the info attribute.
     * 
     * @return void
     * @memberof EntryEditor
     */
    handleCreateEntry() {
      // JSON used for deep copy
      const copy = JSON.parse(JSON.stringify(this.props.info.sections.defaultEntry));
      this.setState({data: {
        ...this.state.data,
        sections: [...this.state.data.sections, copy]
      }});
    }

    /**
     * Event handler for editing sub sections.
     * 
     * @param {*} event
     * @param {Number} index - the index of the section to be edited
     * @return void
     * @memberof EntryEditor
     */
    handleEditSectionText(event) {
      const newSections = [...this.state.data.sections];
      newSections[this.state.currentSection].texts[event.target.name] = event.target.value;
      this.setState({
        sections: newSections
      });
    }

    /**
     * Event handler to cycle through sub sections
     * @param {*} event 
     */
    handleSectionView(modifier) {
      let nextSection = this.state.currentSection + modifier;
      if (nextSection < 0) {
        nextSection = this.state.data.sections.length;
      } else if (nextSection > this.state.data.sections.length) {
        nextSection = 0;
      }
      this.setState({
        currentSection: nextSection
      })
    }

    render() {
        const { classes } = this.props;
        // TODO: change name/id to field-name-id to avoid collision i.e. colours-primary-0
        return (
            <Modal className = {classes.modal}
            // open always set to true, open/close logic handled by portfolio
              open={true}
              // TODO: add onClose save logic
              onClose={() => this.props.onClose(this.state.data, true)}
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
                      value={this.state.data.width}
                      margin="normal"
                      variant="outlined"
                      onChange={(event) => this.handleChange(event, "")}
                      />
                    <TextField 
                      id="height"
                      label="height"
                      name="height"
                      value={this.state.data.height}
                      margin="normal"
                      variant="outlined"
                      onChange={(event) => this.handleChange(event, "")}
                      />
                  </div>
                  <div className={classes.categoryDiv}>
                    {Object.entries(this.state.data.fonts).map(([key, item]) => {
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
                    {Object.entries(this.state.data.colours).map(([key, item]) => {
                      return (
                        <div>
                          <Input 
                            type="color" 
                            value={item} 
                            onChange={(event) => this.handleChange(event, "colours")}
                            style={{width: "100%"}}
                          />
                          <TextField
                            name={key}
                            id={key}
                            value={item}
                            margin="normal"
                            variant="outlined"
                            onChange={(event) => this.handleChange(event, "colours")}
                          />
                          <Typography component="h6" variant="h6">
                            {this.props.info.colours[key].label}
                          </Typography>
                        </div>
                        )
                    })}
                  </div>
                </div>
                <div className={classes.sectionDiv}>
                  <div className={classes.categoryDiv}>
                    {Object.entries(this.state.data.images).map(([key, item]) => {
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
                    {Object.entries(this.state.data.texts).map(([key, item]) => {
                      return (
                        <div>
                          {/* Preview icon that changes according to selected colour */}
                          {/* <Button id="colourPreview"/> */}
                          <TextField
                            name={key}
                            id={key}
                            label={this.props.info.texts[key].label}
                            value={item}
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
                  <IconButton id="left" onClick={() => this.handleSectionView(-1)}>
                    <FaChevronLeft/>
                  </IconButton>
                  {
                    this.state.currentSection === this.state.data.sections.length 
                      ? <IconButton onClick={this.handleCreateEntry}><FaPlus/></IconButton>
                      : <div>
                          <IconButton onClick={(event) => this.handleDeleteSection(event)}><FaTrashAlt/></IconButton>
                          <div className={classes.imgDiv}>
                            {Object.entries(this.state.data.sections[this.state.currentSection].images).map(([key, item]) => {
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
                            {Object.entries(this.state.data.sections[this.state.currentSection].texts).map(([key, item]) => {
                              // TODO: make maxRow field in info?
                              return (
                                <div>
                                  <TextField
                                    name={key}
                                    id={key}
                                    label={this.props.info.sections.entryFormat.texts[key].label}
                                    value={item}
                                    margin="normal"
                                    variant="outlined"
                                    onChange={(event) => this.handleEditSectionText(event)}
                                    multiline
                                    rowsMax={3}
                                  />
                                </div>
                                );
                            })}
                          </div>
                        </div>
                  }
                  <IconButton id="right" onClick={() => this.handleSectionView(1)}>
                    <FaChevronRight/>
                  </IconButton>
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