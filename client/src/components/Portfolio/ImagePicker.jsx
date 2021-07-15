import React, { Component } from 'react';
import { connect } from 'react-redux';
import { repopulate_state } from '../../actions/LoginAction';
import { withStyles } from '@material-ui/core/styles';
import { Button, ButtonBase, Card, CardContent, CardMedia, Fab, IconButton, Modal, TextField, Tooltip, Typography } from '@material-ui/core';
import axios from 'axios';
import { FaFileUpload, FaSave, FaSearch, FaTimes, FaTrash } from 'react-icons/fa';
import { MdAccessAlarm, MdAddAlert } from 'react-icons/md';
import { handleErrors } from '../../handlers/errorHandler';
import { imageCache } from './ImageCache';
import pexelsLogo from '../../res/assets/pexels logo.png';

/**
 * @file ImagePicker component to provide a user interface for users to browse royalty free images
 * 
 * @author Chuan Hao
 * 
 * @see ImagePicker
 */

/**
 * Style generator to dynamically adjust styles based on theme provided
 * 
 * @memberof ImagePicker
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
  title: {
    marginRight: 'auto',
    fontWeight: 'bold'
  },
  modal: {
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    padding: '1%',
    width: '80%',
    height: '80%',
    margin: 'auto',
    backgroundColor: theme.palette.background.default,
    textAlign: 'center',
  },
  cardDiv: {
    display: 'grid',
    width: '100%',
    height: '80%',
    gridTemplateColumns: 'repeat(auto-fill, 290px)',
    justifyContent: 'center',
    overflowY: 'auto',
    marginBlock: 'auto'
  },
  cardMedia: {
    maxHeight: 200,
    overflowY: 'hidden'
  },
  root: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column'
  },
  fab: {
    marginLeft: '5px',
    marginBlock: '5px',
  },
  searchBar: {
    width: '30%',
    minWidth: '300px'
  },
  controlsDiv: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center'
  },
  subtitle: {
    marginRight: 'auto'
  },
  hide: {
    display: 'none'
  },
  imageHeader: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    textAlign: 'center',
    alignItems: 'center'
  }
});

class ImagePicker extends Component {

  /**
   * Populates state with fields passed in as attribute fields.
   * @constructor
   */
  constructor(props) {
    super(props);
    this.state = {
      queryParams: {
        query: '',
        orientation: '',
        size: '',
        color: '',
        locale: '',
        page: 1,
        per_page: 80,
      },
      photos: [],
      image: '',
      attribution: ''
    }
    this.queryImages = this.queryImages.bind(this);
    this.handleImageUpload = this.handleImageUpload.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleQueryChange = this.handleQueryChange.bind(this);

    this.fileUploadRef = React.createRef();
  }

  componentDidMount() {
    // TODO: Add special route for initialization to memoize in backend for api call saving
    this.queryImages();
  }

  /**
     * Event handler for text fields. 
     * Text fields should be named after their keys in the state.
     * 
     * @param {*} event 
     * @return void
     * @memberof EntryEditor
     */
  handleImageUpload(event) {
    const freader = new FileReader();
    freader.readAsDataURL(event.target.files[0]);
    // TODO: add full attribution with photographer links etc.
    freader.onloadend = (e) => this.setState({
      image: e.target.result,
      attribution: ''
    })
  }

  handleQueryChange(event) {
    this.setState({
      queryParams: {
        ...this.state.queryParams,
        [event.target.name]: event.target.value
      }
    })
  }

  handleClose(save) {
    if (save && this.state.image) {
      this.props.onClose(true, {
        image: this.state.image,
        attribution: this.state.attribution
      });
    } else {
      this.props.onClose(false);
    }
  }

  queryImages(event) {
    let queryParams = {};
    if (Boolean(this.state.queryParams.query)) {
      Object.entries(this.state.queryParams).map(([key, value]) => { if (value !== '') queryParams[key] = value });
      axios({
        method: "GET",
        url: process.env.REACT_APP_BACKEND + "/images",
        params: queryParams
      }).then(res => {
        this.setState({
          photos: res.data.pexels.photos
        })
        console.log(JSON.stringify(res.data.pexels));
      }).catch(err => {
        handleErrors(err);
      })
    } else {
      this.setState({
        photos: imageCache.photos
      })
    }

  }

  render() {
    const { classes } = this.props;
    // console.log(this.state)
    return (
      <Modal
        className={classes.modal}
        // open always set to true, open/close logic handled by portfolio
        open={this.props.open}
        hideBackdrop
        onClose={() => this.handleClose(true)}
        aria-labelledby="Image gallery"
        aria-describedby="Select any image"
      >
        <div className={classes.root}>
          <input
            accept="image/*"
            className={classes.hide}
            ref={this.fileUploadRef}
            type="file"
            onChange={this.handleImageUpload}
          // value={item}
          />
          <div className={classes.imageHeader}>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              fontWeight="bold"
              noWrap
              className={classes.title}
            >
              Image Gallery
            </Typography>
            <TextField
              name="query"
              id="query"
              label="Search images"
              variant="outlined"
              value={this.state.queryParams.query}
              onChange={this.handleQueryChange}
              className={classes.searchBar}
            />
            <Fab
              variant="extended"
              onClick={this.queryImages}
              className={classes.fab}
            >
              <FaSearch />
              Search
            </Fab>

          </div>
          <div className={classes.cardDiv}>
            {this.state.photos !== undefined && this.state.photos !== []
              ? this.state.photos.map((photo) => {
                const photographer = photo.photographer;
                const photographer_url = photo.photographer_url;
                const thumbnail = photo.src.tiny;
                const id = photo.id;
                return (
                  <div>

                    <Button onClick={() => this.setState({ image: photo.src.original, attribution: photo.photographer })}>
                      <Tooltip arrow title={photographer} placement="top">
                        <img src={thumbnail} alt={photographer} />
                      </Tooltip>
                    </Button>
                  </div>
                );
              })
              : null
            }
          </div>
          <div className={classes.controlsDiv}>
            <Button onClick={() => window.open('https://www.pexels.com/')} className={classes.subtitle}>
              <Typography>
                Images provided by Pexels
              </Typography>
            </Button>
            <Fab
              variant="extended"
              onClick={() => this.fileUploadRef.current.click()}
              className={classes.fab}
            >
              <FaFileUpload />
              UPLOAD
            </Fab>
            <Fab
              variant="extended"
              onClick={() => this.handleClose(true)}
              className={classes.fab}>
              <FaSave />
              SAVE
            </Fab>
            <Fab
              variant="extended"
              onClick={() => this.handleClose(false)}
              className={classes.fab}>
              <FaTrash />
              CANCEL
            </Fab>
          </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(ImagePicker));