import React, { Component, PureComponent } from 'react';
import { connect } from 'react-redux';
import { repopulate_state } from '../actions/LoginAction';
import { withStyles } from '@material-ui/core/styles';
import { Button, IconButton, TextField, Typography, Modal, Input, Fab, MenuList, MenuItem, Menu, Tab, Tabs, Popover } from '@material-ui/core';
import { FaPlus, FaTrashAlt, FaChevronLeft, FaChevronRight, FaSave, FaTimes, FaEdit } from "react-icons/fa";
import { fonts } from '../styles/fonts';
import * as icons from '../styles/icons';
import ImagePicker from './ImagePicker';
import TextEditor from './TextEditor';
import SimpleTextEditor from './SimpleTextEditor';
import { SketchPicker } from 'react-color';
import ColourPicker from './ColourPicker';
import DimensionSlider from './DimensionSlider';

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
    backgroundColor: theme.palette.background.default,
    opacity: '85%'
  },
  modal: {
    overflowX: 'hidden',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    padding: '1%',
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
    gridTemplateRows: 'auto'
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
  gridDiv: {
    display: 'grid',
    width: '100%',
    gridTemplateColumns: 'repeat(auto-fill, 6em)',
    gridGap: '10px',
    justifyContent: 'center',
    height: '80%',
    overflowY: 'auto',
    overflowX: 'hidden'
  },
  iconBtn: {
    width: '4em',
    height: '3em'
  },
  iconDiv: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: 'inherit',
    height: 'inherit'
  },
  subModal: {
    width: '80%',
    height: '80%',
    margin: 'auto',
    backgroundColor: theme.palette.primary.main
  },
  hide: {
    display: 'none'
  },
  maxHeightWidth: {
    width: '100%',
    height: '100%'
  },
  entryIcon: {
    height: 'inherit'
  },
  entryIconName: {
    width: 'inherit',
    fontSize: '0.5em'
  },
  maxWidth: {
    width: '100%'
  },
  entryInfoDiv: {
    display: 'flex',
    flexDirection: 'column'
  },
  complexTextDiv: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'start'
  },
  colBtn: {
    padding: '1px',
    minWidth: 0
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
class EntryEditor extends PureComponent {
  // TODO: check if componenetDidMount can overwrite constructor

  /**
   * Populates state with fields passed in as attribute fields.
   * @constructor
   */
  constructor(props) {
    super(props);
    this.state = {
      width: '100%',
      height: '100%',
      fonts: {},
      colours: {},
      images: {},
      texts: {},
      sections: {},

      data: null,

      info: null,
      showEditor: false,

      showDimension: false,

      anchorEl: null,

      showIcon: false,
      iconCategory: 'ai',

      editCategory: 'colours',
      editField: '',
      editFormat: '',
      showColour: false,

      showFont: false,

      editSection: false,
      currentSection: 0,

      editField: '',

      showImage: false,
    }
    this.handleCreateEntry = this.handleCreateEntry.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleImageUpload = this.handleImageUpload.bind(this);
    this.handleSectionView = this.handleSectionView.bind(this);
    this.handleCloseEditor = this.handleCloseEditor.bind(this);
    this.handleIconSelect = this.handleIconSelect.bind(this);
    this.handleFont = this.handleFont.bind(this);

    this.serializeSlate = this.serializeSlate.bind(this);
    this.deserializeSlate = this.deserializeSlate.bind(this);

    this.fileUploadRef = React.createRef();
    // this.imgColPickerRef = React.createRef();
  }

  // TODO: elements read from state instead of props
  // TODO: unbounded mongo models


  shouldComponentUpdate(nextProps, nextState) {
    return true;
  }


  /**
   * Event handler for text fields.
   * Text fields should be named after their keys in the state.
   * @param {*} value 
   * @param {string} field 
   * @param {string} category 
   * @param {boolean} section 
   * @memberof EntryEditor
   */
  handleChange(value, field, category, section) {
    let formatted = value;
    switch (category) {
      case 'images':
        formatted = { src: value, format: this.state.editFormat }
        break;
      default:
        break;
    }

    if (!category) {
      this.setState({
        [field]: formatted
      });
    } else {
      if (!section) {
        const newObject = { ...this.state[category] };
        newObject[field] = formatted;
        this.setState({
          [category]: newObject
        });
      } else {
        const newObject = [...this.state.sections];
        newObject[section][category][field] = formatted;
        this.setState({
          sections: newObject
        });
      }
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
    const freader = new FileReader();
    freader.readAsDataURL(event.target.files[0]);
    freader.onloadend = (e) => {
      if (!this.state.editSection) {
        this.setState({
          images: {
            ...this.state.images,
            [this.state.editField]: {
              src: e.target.result,
              format: 'image'
            }
          },
          anchorEl: null
        })
      } else {
        const newSections = [...this.state.sections];
        // TODO: create deep copy, mutating .src currently mutates original array elements
        newSections[this.state.currentSection].images[this.state.editField].src = e.target.result;
        newSections[this.state.currentSection].images[this.state.editField].format = 'image'
        this.setState({
          sections: newSections,
          anchorEl: null
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
    const spliced = this.state.sections.filter((item, filterIndex) => filterIndex !== this.state.currentSection);
    this.setState({
      sections: spliced
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
    const copy = JSON.parse(JSON.stringify(this.state.info.sections.defaultEntry));
    this.setState({
      sections: [...this.state.sections, copy]
    });
  }

  /**
   * Event handler to cycle through sub sections
   * @param {*} event 
   */
  handleSectionView(modifier) {
    let nextSection = this.state.currentSection + modifier;
    if (nextSection < 0) {
      nextSection = this.state.sections.length;
    } else if (nextSection > this.state.sections.length) {
      nextSection = 0;
    }
    this.setState({
      currentSection: nextSection
    })
  }

  /**
   * Event handler to save changes made in the editor and close the editor
   * @param {boolean} save whether the changes should be saved to state
   */
  handleCloseEditor(save) {

    if (save) {
      const ret = this.state.data;
      ret.width = this.state.width;
      ret.height = this.state.height;
      ret.fonts = this.state.fonts;
      ret.colours = this.state.colours;
      ret.images = this.state.images;
      ret.texts = this.state.texts;
      ret.sections = this.state.sections;

      this.props.onClose(ret, true);
    } else {
      this.props.onClose(null, false);
    }
    this.setState({
      showEditor: false
    })
  }

  /**
   * Event handler to update the font the user chose
   * @param {object} event 
   * @param {string} field the name of the text group to adopt the new font
   * @param {string} font the font family to be changed to
   */
  handleFont(event, field, font) {
    if (!field) {
      this.setState({
        anchorEl: event.currentTarget,
        showFont: true
      })
    } else {
      this.setState({
        fonts: {
          ...this.state.fonts,
          [field]: font
        },
        anchorEl: null,
        showFont: false,
      })
    }
  }

  /**
   * Event handler to update the chosen svg from the icon picker
   * @param {string} iconName a / separated string indicating the path to the specified icon
   */
  handleIconSelect(iconName) {
    const newValue = `${this.state.iconCategory}/${iconName}`;
    if (!this.state.editSection) {
      this.setState({
        images: {
          ...this.state.images,
          [this.state.editField]: {
            src: newValue,
            format: 'icon'
          }
        },
        showIcon: false,
        anchorEl: null
      })
    } else {
      const newSections = [...this.state.sections];
      // TODO: create deep copy, mutating .src currently mutates original array elements
      newSections[this.state.currentSection].images[this.state.editField].src = newValue;
      newSections[this.state.currentSection].images[this.state.editField].format = 'icon';
      this.setState({
        sections: newSections,
        showIcon: false,
        anchorEl: null
      });
    }
  }

  openWith(fields, info) {
    this.setState({
      showEditor: true,
      width: fields.width,
      height: fields.height,
      fonts: fields.fonts,
      colours: fields.colours,
      images: fields.images,
      texts: fields.texts,
      sections: fields.sections,

      data: fields,

      info: info
    })
  }

  serializeSlate(value) {
    return (
      value.map(n => Node.string(n)).join('\n')
    );
  }

  deserializeSlate(string) {
    return string.split('\n').map(line => {
      return {
        children: [{ text: line }],
      }
    })
  }

  render() {
    const { classes } = this.props;
    // TODO: change name/id to field-name-id to avoid collision i.e. colours-primary-0
    // Prevent from rendering if info not provided, prevent errors trying to read properties from null
    if (!this.state.info) {
      return null;
    }

    return (
      <div
        data-html2canvas-ignore="true"
        className
      >
        <Modal className={classes.modal}
          // open always set to true, open/close logic handled by portfolio
          open={this.state.showEditor}
          // TODO: add onClose save logic
          onClose={() => this.handleCloseEditor(true)}
          aria-labelledby="Entry editor"
          aria-describedby="Edit your entry fields here"
        >
          <div className={classes.root}>
            <ImagePicker open={this.state.showImage} onClose={(save, data) => {
              if (!save) {
                this.setState({ showImage: false });
                return null;
              }

              // TODO: Add attribution support
              if (this.state.editSection) {
                const newSections = [...this.state.sections];
                newSections[this.state.currentSection].images[this.state.editField].src = data.image;
                newSections[this.state.currentSection].images[this.state.editField].format = 'image';
                this.setState({
                  sections: newSections,
                  showImage: false,
                  anchorEl: null
                });
              } else {
                this.setState({
                  images: {
                    ...this.state.images,
                    [this.state.editField]: {
                      src: data.image,
                      format: 'image'
                    }
                  },
                  showImage: false,
                  anchorEl: null
                })
              }
            }} />
            <Typography component="h3" variant="h3">Entry editor</Typography>
            <ColourPicker
              open={this.state.showColour}
              anchorEl={this.state.anchorEl}
              onClose={(save, colour) => {
                if (save) {
                  this.handleChange(colour, this.state.editField, this.state.editCategory, this.state.currentSection)
                }
                this.setState({ showColour: false, anchorEl: null })
              }}
            />
            <Modal
              open={this.state.showIcon}
              aria-labelledby="icon selection modal"
              aria-describedby="a modal for users to pick an icon"
              className={`${classes.modal} ${classes.subModal}`}
              onClose={() => this.setState({ showIcon: false, anchorEl: null })}
            >
              <div className={classes.maxHeightWidth}>
                <Tabs
                  name="iconCategory"
                  value={this.state.iconCategory}
                  onChange={(event, tab) => this.setState({ iconCategory: tab })}
                  variant="scrollable"
                  scrollButtons="auto"
                >
                  {Object.entries(icons).map(([key, icon]) => {
                    return (<Tab label={icon.label} value={key} className={classes.entryIcon} />)
                  })}
                </Tabs>
                <div role='tabpanel' className={classes.gridDiv}>
                  {Object.entries(icons[this.state.iconCategory].icons).map(([iconName, value]) => {
                    const PreviewIcon = value;
                    return (
                      <IconButton onClick={() => this.handleIconSelect(iconName)} >
                        <div className={classes.iconDiv}>
                          <PreviewIcon size='1.5em' />
                          <Typography noWrap variant='h6' component='h6' className={classes.entryIconName}  >
                            {iconName}
                          </Typography>
                        </div>
                      </IconButton>);
                  })}
                </div>
              </div>
            </Modal>

            <div className={classes.rowDiv}>
              <div className={classes.styleDiv}>
                <div>
                  <DimensionSlider
                    label={'width'}
                    defaultValue={this.state.width}
                    onClose={(save, value) => this.handleChange(value, 'width')}
                  />
                  <DimensionSlider
                    label={'height'}
                    defaultValue={this.state.height}
                    onClose={(save, value) => this.handleChange(value, 'width')}
                  />
                </div>
                {Object.entries(this.state.fonts).map(([key, item]) => {
                  return (
                    <div>
                      <Button aria-controls="simple-menu" aria-haspopup="true" onClick={(event) => this.handleFont(event)}>
                        <Typography variant="inherit" style={{ fontFamily: item }}>
                          {this.state.info.fonts[key].label}
                        </Typography>
                      </Button>
                      <Menu
                        name={key}
                        id={key}
                        anchorEl={this.state.anchorEl}
                        keepMounted
                        open={this.state.showFont}
                        onClose={() => this.setState({ anchorEl: null })}
                      >
                        {fonts.map((fontName) => (
                          <MenuItem onClick={(event) => this.handleFont(event, key, fontName)}>
                            <Typography variant="inherit" style={{ fontFamily: fontName }}>
                              {fontName}
                            </Typography>
                          </MenuItem>
                        ))}
                      </Menu>
                    </div>
                  )
                })}
                {Object.entries(this.state.colours).map(([key, item]) => {
                  return (
                    <div>
                      <Button
                        className={classes.colBtn}
                        variant="outlined"
                        onClick={(event) => this.setState({
                          anchorEl: event.currentTarget,
                          showColour: true,
                          editCategory: 'colours',
                          editField: key,
                          editSection: false
                        })}
                      >
                        <div
                          style={{ width: '2em', height: '2em', backgroundColor: item }}
                        />
                      </Button>
                      <Typography component="h6" variant="h6">
                        {this.state.info.colours[key].label}
                      </Typography>
                    </div>
                  )
                })}
              </div>
              <div className={classes.colDiv}>
                <div className={classes.rowDiv}>
                  <div className={classes.imgGrid}>
                    {Object.entries(this.state.images).map(([key, item]) => {
                      let Preview;
                      switch (item.format) {
                        case 'image':
                          Preview = (props) => <img src={item.src} className={classes.imgPreview} />;
                          break;
                        case 'icon':
                          const category = item.src.split('/');
                          Preview = icons[category[0]].icons[category[1]];
                          break;
                        case 'colour':
                          Preview = (props) => <div style={{ backgroundColor: item.src, height: 100, width: 100 }} />;
                          break;
                        default:
                          break;
                      }
                      return (
                        <div>
                          <Button aria-controls="media-menu" aria-haspopup="true" onClick={(event) => this.setState(
                            {
                              anchorEl: event.currentTarget,
                              editField: key,
                              editSection: false,
                              editCategory: 'images'
                            })}>
                            <Preview />
                            <Typography>
                              {this.state.info.images[key].label}
                            </Typography>
                          </Button>
                          <Menu
                            id="media-menu"
                            anchorEl={this.state.anchorEl}
                            keepMounted
                            open={Boolean(this.state.anchorEl) && !this.state.editSection && this.state.editField === key}
                            onClose={() => this.setState({ anchorEl: null })}
                          >
                            {this.state.info.images[key].format.map((format) => {
                              switch (format) {
                                case 'image':
                                  return (<MenuItem onClick={() => {
                                    this.setState({
                                      showImage: true,
                                      editFormat: 'image',
                                      anchorEl: null,
                                    })
                                  }}
                                  >{format}</MenuItem>)
                                case 'icon':
                                  const category = item.src.split('/');
                                  return (<MenuItem onClick={() => this.setState(
                                    {
                                      showIcon: true,
                                      iconCategory: category[0],
                                      editFormat: 'icon',
                                      anchorEl: null,
                                    })}
                                  >{format}</MenuItem>);
                                case 'colour':
                                  return (
                                    <MenuItem
                                      onClick={(event) => this.setState({
                                        anchorEl: event.currentTarget,
                                        showColour: true,
                                        editFormat: 'colour',
                                        anchorEl: null,
                                      })
                                      }
                                    > { format}</MenuItem>);
                                default:
                                  break;
                              }
                            })}
                          </Menu>
                        </div>
                      );
                    })}
                  </div>
                  <div className={classes.textGrid}>
                    {Object.entries(this.state.texts).map(([key, item]) => {
                      if (this.state.info.texts[key].type === "complexText") {
                        return (
                          <div className={classes.complexTextDiv}>
                            <Typography variant="h6" component="h6">{this.state.info.texts[key].label}</Typography>
                            <TextEditor
                              item={item}
                              onClose={(value) => this.handleChange(value, key, "texts")}
                            />
                          </div>
                        );
                      } else {
                        return (
                          <SimpleTextEditor
                            label={this.state.info.texts[key].label}
                            item={item}
                            onClose={(value) => this.handleChange(value, key, "texts")}
                            category={"texts"}
                            section={false}
                          />
                          // <TextField
                          //   name={key}
                          //   id={key}
                          //   label={this.state.info.texts[key].label}
                          //   value={item}
                          //   margin="normal"
                          //   variant="outlined"
                          //   onChange={(event) => this.handleChange(event, "texts")}
                          // />
                        );
                      }
                    })}
                  </div>
                </div>
                {this.state.info.sections.enabled &&
                  <div className={classes.sectionDiv}>
                    <IconButton id="left" onClick={() => this.handleSectionView(-1)}>
                      <FaChevronLeft />
                    </IconButton>
                    {
                      this.state.currentSection === this.state.sections.length
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
                              {Object.entries(this.state.sections[this.state.currentSection].images).map(([key, item]) => {
                                let Preview;
                                switch (item.format) {
                                  case 'image':
                                    Preview = (props) => <img src={item.src} className={classes.imgPreview} />;
                                    break;
                                  case 'icon':
                                    const category = item.src.split('/');
                                    const SvgIcon = icons[category[0]].icons[category[1]];
                                    Preview = (props) => <SvgIcon size='3em' />
                                    break;
                                  case 'colour':
                                    Preview = (props) => <div style={{ backgroundColor: item.src, height: 100, width: 100 }} />;
                                    break;
                                  default:
                                    break;
                                }
                                return (
                                  <div>
                                    <Button aria-controls="media-menu" aria-haspopup="true" onClick={(event) => this.setState({
                                      anchorEl: event.currentTarget,
                                      editField: key,
                                      editSection: true
                                    })}>
                                      <div className={classes.entryInfoDiv}>
                                        <Preview />
                                        <Typography>
                                          {this.state.info.sections.entryFormat.images[key].label}
                                        </Typography>
                                      </div>
                                    </Button>
                                    <Menu
                                      id="media-menu"
                                      anchorEl={this.state.anchorEl}
                                      keepMounted
                                      open={Boolean(this.state.anchorEl) && this.state.editSection && this.state.editField === key}
                                      onClose={() => this.setState({ anchorEl: null })}
                                    >
                                      {this.state.info.sections.entryFormat.images[key].format.map((format) => {
                                        // TODO: debug change format errors
                                        switch (format) {
                                          case 'image':
                                            return (<MenuItem onClick={() => this.setState(
                                              {
                                                showImage: true,
                                                editFormat: 'image'
                                              })}
                                            >{format}</MenuItem>)
                                          case 'icon':
                                            const category = item.src.split('/');
                                            return (<MenuItem onClick={() => this.setState(
                                              {
                                                showIcon: true,
                                                iconCategory: category[0],
                                                editFormat: 'icon'
                                              })}
                                            >{format}</MenuItem>);
                                          case 'colour':
                                            return (<MenuItem onClick={(event) => this.setState({
                                              anchorEl: event.currentTarget,
                                              showColour: true,
                                              editFormat: 'colour'
                                            })
                                            }>{format}</MenuItem>);
                                          default:
                                            break;
                                        }
                                      })}
                                    </Menu>
                                  </div>
                                );
                              })}
                            </div>
                            <div className={classes.textGrid}>
                              {Object.entries(this.state.sections[this.state.currentSection].texts).map(([key, item]) => {
                                // TODO: make maxRow field in info?
                                if (this.state.info.sections.entryFormat.texts[key].type === "complexText") {
                                  return (
                                    <div className={classes.complexTextDiv}>
                                      <Typography variant="h6" component="h6">{this.state.info.sections.entryFormat.texts[key].label}</Typography>
                                      <TextEditor
                                        item={item}
                                        onClose={(value, name) => this.handleChange(value, key, "texts", true)} />
                                    </div>
                                  );
                                } else {
                                  return (
                                    <SimpleTextEditor
                                      label={this.state.info.sections.entryFormat.texts[key].label}
                                      item={item}
                                      onClose={(value) => this.handleChange(value, key, "texts", true)}
                                      category={"texts"}
                                      section={true}
                                    />
                                    // <TextField
                                    //   name={key}
                                    //   id={key}
                                    //   label={this.state.info.sections.entryFormat.texts[key].label}
                                    //   value={item}
                                    //   margin="normal"
                                    //   variant="outlined"
                                    //   onChange={(event) => this.handleChange(event, 'texts', true)}
                                    //   multiline
                                    //   rowsMax={3}
                                    // />
                                  );
                                }
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
      </div >
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

export default connect(mapStateToProps, mapDispatchToProps, null, { forwardRef: true })(withStyles(styles)(EntryEditor))