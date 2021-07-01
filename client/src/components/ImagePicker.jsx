import React, { Component } from 'react';
import { connect } from 'react-redux';
import { repopulate_state } from '../actions/LoginAction';
import { withStyles } from '@material-ui/core/styles';
import { Button, ButtonBase, Card, CardContent, CardMedia, Modal, Typography } from '@material-ui/core';
import axios from 'axios';

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
  modal: {
    overflowX: 'hidden',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    padding: '1%',
  },
  cardDiv: {
    display: 'grid',
    width: '100%',
    gridTemplateColumns: 'repeat(auto-fill, 345px)',
    gridGap: '55px',
    justifyContent: 'center',
    overflowY: 'auto'
  },
  cardMedia: {
    maxHeight: 200,
    overflow: 'hidden'
  },
  modal: {
    overflowX: 'hidden',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    padding: '1%',
  },
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
        query: 'background',
        orientation: '',
        size: '',
        color: '',
        locale: '',
        page: 1,
        per_page: 30,
      },
      photos: []
    }
    this.queryImages = this.queryImages.bind(this);
  }

  componentDidMount() {
    console.log("mount")
    this.queryImages();
  }



  queryImages(event) {
    let queryParams = {};
    Object.entries(this.state.queryParams).map(([key, value]) => { if (value !== '') queryParams[key] = value });
    axios({
      method: "GET",
      url: process.env.REACT_APP_BACKEND + "/images",
      params: queryParams
    }).then(res => {
      this.setState({
        photos: res.data.pexels.photos
      })
      console.log(res.data.pexels.photos);
    }).catch(err => {
      console.log(err);
    })
  }

  render() {
    const { classes } = this.props;
    // console.log(this.state)
    return (
      <Modal
        className={classes.modal}
        // open always set to true, open/close logic handled by portfolio
        open={false}
        // TODO: add onClose save logic
        onClose={() => this.handlePickImage(true)}
        aria-labelledby="Image gallery"
        aria-describedby="Select any image"
      >
        <div>
          <div className={classes.cardDiv}>
            {this.state.photos !== undefined && this.state.photos !== []
              ? this.state.photos.map((photo) => {
                const photographer = photo.photographer;
                const photographer_url = photo.photographer_url;
                const thumbnail = photo.src.tiny;
                const id = photo.id;
                return (
                  <div>
                    <Button>
                      <img src={thumbnail} alt={photographer} />
                    </Button>
                  </div>
                );
              })
              : null
            }
          </div>
        </div>
      </Modal>)
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