import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Button, IconButton, TextField, Typography, Input, Fab, MenuList, MenuItem, Menu, Tab, Tabs, Popover } from '@material-ui/core';
import { FaSave, FaTimes } from 'react-icons/fa';
import { SketchPicker } from 'react-color';
/**
 * @file ColourPicker component for users to pick colours
 * 
 * @author Chuan Hao
 * 
 * @see ColourPicker
 */

/**
 * Style generator to dynamically adjust styles based on theme provided
 * 
 * @memberof ColourPicker
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
    backgroundColor: theme.palette.primary.main,
    textAlign: 'center',
  }
});

class ColourPicker extends Component {

  /**
   * Populates state with fields passed in as attribute fields.
   * @constructor
   */
  constructor(props) {
    super(props);
    this.state = {
      colour: '#fff'
    }
    this.handleClose = this.handleClose.bind(this);
  }


  handleClose(save) {
    if (save && this.state.image) {
      this.props.onClose(true, {
        image: this.state.image,
        attribution: ''
      });
    } else {
      this.props.onClose(false);
    }
  }

  render() {
    const { classes } = this.props;
    // console.log(this.state)
    return (
      <Popover
        open={this.props.open}
        anchorEl={this.props.anchorEl}
        onClose={(event) => this.props.onClose(true, this.state.colour)}
      >
        <SketchPicker
          color={this.state.colour}
          onChange={(color, event) => this.setState({ colour: color.hex })}
          // onChangeComplete={(color, event) => {
          //   this.setState({ colour: color.hex });
          // }}
          disableAlpha={true}
        />
        <div>
          <Button onClick={(event) => this.props.onClose(true, this.state.colour)}>OK</Button>
          <Button onClick={() => this.props.onClose(false)}>CANCEL</Button>
        </div>
      </Popover>
    )
  }
}


export default withStyles(styles)(ColourPicker);