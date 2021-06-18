import React, { Component } from 'react';
import { connect } from 'react-redux';
import { repopulate_state } from '../actions/LoginAction';
import { withStyles } from '@material-ui/core/styles';
import { Button, IconButton, TextField, Typography, Modal, Input, Fab } from '@material-ui/core';
import { FaPlus, FaTrashAlt, FaChevronLeft, FaChevronRight, FaSave, FaTimes, FaEdit } from "react-icons/fa";


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
    overflowX: 'hidden',
    overflowY: 'auto',
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
  textGrid: {
    margin: '1vw',
    display: 'grid',
    width: '100%',
    gridTemplateColumns: 'repeat(auto-fill, 200px)'
  },
  imgGrid: {
    margin: '1vw',
    display: 'grid',
    width: '100%',
    gridTemplateColumns: 'repeat(auto-fill, 150px)'
  },
  imgPreview: {
    width: '5vw',
    height: '5vw'
  },
  sectionDiv: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    marginTop: 'auto'
  },
  div: {
    padding: '10px'
  },
  rowDiv: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    overflow: 'auto',
  },
  colDiv: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column'
  },
  styleDiv: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    overflow: 'auto'
  },
  addSectionSpacer: {
    height: theme.spacing(5)
  },
  ctrlDiv: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: 'auto',
    marginLeft: 'auto'
  },
  editFAB: {
    position: 'absolute',
    marginTop: '2vw',
    marginLeft: '2vw'
  },
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
    const copied_fields = JSON.parse(JSON.stringify(this.props.fields));
    this.state = {
      data: copied_fields,
      currentSection: 0,
      showEditor: false
    }
    this.handleCreateEntry = this.handleCreateEntry.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleImageUpload = this.handleImageUpload.bind(this);
    this.handleEditSectionText = this.handleEditSectionText.bind(this);
    this.handleSectionView = this.handleSectionView.bind(this);
    this.handleCloseEditor = this.handleCloseEditor.bind(this);
    this.handleShowEditor = this.handleShowEditor.bind(this);
  }

  /**
   * Displays the editor and resets state fields since react does not call constructor again
   * 
   * @return void
   * @memberof EntryEditor
   */
  handleShowEditor() {
    const copied_fields = JSON.parse(JSON.stringify(this.props.fields));
    this.setState({
      data: copied_fields,
      currentSection: 0,
      showEditor: true
    })
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
        data: {
          ...this.state.data,
          [event.target.name]: event.target.value
        }
      });
    } else {
      const originalCat = { ...this.state.data[category] };
      originalCat[event.target.name] = event.target.value;
      this.setState({
        data: {
          ...this.state.data,
          [category]: originalCat
        }
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
  handleImageUpload(event, sectionIndex) {
    // TODO: Open a upload dialog
    const freader = new FileReader();
    freader.readAsDataURL(event.target.files[0]);
    freader.onloadend = (e) => {
      if (sectionIndex === undefined) {
        this.setState({
          data: {
            ...this.state.data,
            images: {
              ...this.state.data.images,
              [event.target.name]: e.target.result
            }
          }
        })
      } else {
        const newSections = [...this.state.data.sections];
        newSections[this.state.currentSection].images[event.target.name] = e.target.result;
        this.setState({
          data: {
            ...this.state.data,
            sections: newSections
          }
        });
      }
    }
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
    this.setState({
      data: {
        ...this.state.data,
        sections: [...this.state.data.sections, copy]
      }
    });
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
      data: {
        ...this.state.data,
        sections: newSections
      }
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

  handleCloseEditor(save) {
    if (save) {
      this.props.onClose(this.state.data, true);
    } else {
      this.props.onClose(null, false);
    }
    this.setState({
      showEditor: false
    })
  }


  render() {
    const { classes } = this.props;
    // TODO: change name/id to field-name-id to avoid collision i.e. colours-primary-0
    return (
      <div
        data-html2canvas-ignore="true"
      >
        <Fab
          className={classes.editFAB}
          onClick={this.handleShowEditor}>
          <FaEdit />
        </Fab>
        <Modal className={classes.modal}
          // open always set to true, open/close logic handled by portfolio
          open={this.state.showEditor}
          // TODO: add onClose save logic
          onClose={() => this.handleCloseEditor(true)}
          aria-labelledby="Entry editor"
          aria-describedby="Edit your entry fields here"
        >
          <div className={classes.root}>
            <Typography component="h3" variant="h3">Entry editor</Typography>
            <div className={classes.rowDiv}>
              <div className={classes.styleDiv}>
                <TextField
                  id="width"
                  label="width"
                  name="width"
                  value={this.state.data.width}
                  margin="normal"
                  variant="outlined"
                  onChange={(event) => this.handleChange(event, "")}
                  className={classes.styleInput}
                />
                <TextField
                  id="height"
                  label="height"
                  name="height"
                  value={this.state.data.height}
                  margin="normal"
                  variant="outlined"
                  onChange={(event) => this.handleChange(event, "")}
                  className={classes.styleInput}
                />
                {Object.entries(this.state.data.fonts).map(([key, item]) => {
                  return (<TextField
                    name={key}
                    id={key}
                    label={this.props.info.fonts[key].label}
                    value={item}
                    margin="normal"
                    variant="outlined"
                    onChange={(event) => this.handleChange(event, "fonts")}
                    className={classes.styleInput} />)
                })}
                {Object.entries(this.state.data.colours).map(([key, item]) => {
                  return (
                    <div>
                      <Input
                        type="color"
                        name={key}
                        id={key}
                        value={item}
                        onChange={(event) => this.handleChange(event, "colours")}
                        style={{ width: "100%" }}
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
              <div className={classes.colDiv}>
                <div className={classes.rowDiv}>
                  <div className={classes.imgGrid}>
                    {Object.entries(this.state.data.images).map(([key, item]) => {
                      return (
                        <div>
                          <input
                            accept="image/*"
                            className={classes.imgInput}
                            style={{ display: "none" }}
                            id={key}
                            name={key}
                            type="file"
                            onChange={this.handleImageUpload}
                          // value={item}
                          />
                          <label htmlFor={key}>
                            <Button component="span">
                              <img src={item} className={classes.imgPreview} />
                            </Button>
                            <Typography>
                              {this.props.info.images[key].label}
                            </Typography>
                          </label>
                        </div>
                      );
                    })}
                  </div>
                  <div className={classes.textGrid}>
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
                {this.props.info.sections.enabled &&
                  <div className={classes.sectionDiv}>
                    <IconButton id="left" onClick={() => this.handleSectionView(-1)}>
                      <FaChevronLeft />
                    </IconButton>
                    {
                      this.state.currentSection === this.state.data.sections.length
                        ? <div className={classes.colDiv}>
                          <Typography component="h4" variant="h4" className={classes.colDiv}>Add new section</Typography>
                          <div className={classes.addSectionSpacer} />
                          <IconButton onClick={this.handleCreateEntry}><FaPlus /></IconButton>
                        </div>
                        : <div className={classes.colDiv}>
                          <div className={classes.rowDiv}>
                            <Typography component="h4" variant="h4" className={classes.colDiv}>Section {this.state.currentSection + 1}</Typography>
                            <IconButton onClick={(event) => this.handleDeleteSection(event)}><FaTrashAlt /></IconButton>
                          </div>
                          <div className={classes.rowDiv}>
                            <div className={classes.imgGrid}>
                              {Object.entries(this.state.data.sections[this.state.currentSection].images).map(([key, item]) => {
                                return (
                                  <div>
                                    <input
                                      accept="image/*"
                                      className={classes.imgInput}
                                      style={{ display: "none" }}
                                      id={key}
                                      name={key}
                                      type="file"
                                      onChange={(event) => this.handleImageUpload(event, this.state.currentSection)}
                                    // value={item}
                                    />
                                    <label htmlFor={key}>
                                      <Button component="span">
                                        <img src={item} className={classes.imgPreview} />
                                      </Button>
                                      <Typography>
                                        {this.props.info.sections.entryFormat.images[key].label}
                                      </Typography>
                                    </label>
                                  </div>
                                );
                              })}
                            </div>
                            <div className={classes.textGrid}>
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
                        </div>
                    }
                    <IconButton id="right" onClick={() => this.handleSectionView(1)}>
                      <FaChevronRight />
                    </IconButton>
                  </div>}
              </div>
            </div>
            <div className={classes.ctrlDiv}>
              <Fab variant="extended" onClick={() => this.handleCloseEditor(true)}><FaSave />Save</Fab>
              <Fab variant="extended" onClick={() => this.handleCloseEditor(false)}><FaTimes />Cancel</Fab>
            </div>
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