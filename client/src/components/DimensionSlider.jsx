import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Button, IconButton, TextField, Typography, Modal, Input, Fab, MenuList, MenuItem, Menu, Tab, Tabs, Popover, Select } from '@material-ui/core';
import { FaSave, FaTimes } from 'react-icons/fa';
import { SketchPicker } from 'react-color';

/**
 * @file DimensionSlider component for users to pick colours
 * 
 * @author Chuan Hao
 * 
 * @see DimensionSlider
 */

/**
 * Style generator to dynamically adjust styles based on theme provided
 * 
 * @memberof DimensionSlider
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

const formats = ["auto",
  "initial",
  "inherit",
  "min-content",
  "max-content",
  "fit-content"];

class DimensionSlider extends Component {
  /**
   * Populates state with fields passed in as attribute fields.
   * @constructor
   */
  constructor(props) {
    super(props);
    const isValue = !formats.includes(this.props.defaultValue);
    const regex = isValue ? this.props.defaultValue.match(/(-?[\d.]+)([a-z%]*)/) : null;
    console.log(regex);

    this.state = {
      units: isValue ? regex[2] : '%',
      value: isValue ? regex[1] : 100,
      format: isValue ? 'value' : this.props.defaultValue,
      showSlider: false,
      anchorEL: null,
    }
    this.handleClose = this.handleClose.bind(this);
    this.handleFormat = this.handleFormat.bind(this);
    this.handleValue = this.handleValue.bind(this);
    this.handleUnits = this.handleUnits.bind(this);
  }

  handleValue(event) {
    this.setState({ value: event.target.value })
  }

  handleFormat(event) {
    this.setState({ format: event.target.value })
  }

  handleUnits(event) {
    this.setState({ units: event.target.value })
  }

  handleClose(save) {
    if (save) {
      this.props.onClose(true, this.state.format === 'value' ? `${this.state.value}${this.state.units}` : this.state.format);
    } else {
      this.props.onClose(false);
    }
  }

  render() {
    const { classes } = this.props;
    return (
      <div>
        <Typography>{this.props.label}</Typography>
        <Button
          onClick={(e) => this.setState({ showSlider: true, anchorEL: e.currentTarget })}
        >{this.state.format === 'value' ? `${this.state.value}${this.state.units}` : this.state.format}</Button>
        <Popover
          open={this.state.showSlider}
          anchorEl={this.state.anchorEl}
          onClose={() => {
            this.handleClose(
              true,
              this.state.format === 'value'
                ? `${this.state.value}${this.state.units}`
                : this.state.format
            )
            this.setState({ showSlider: false })
          }}
        >
          <Select
            value={this.state.format}
            onChange={this.handleFormat}
          >
            <MenuItem value="value">value</MenuItem>
            <MenuItem value="auto">auto</MenuItem>
            <MenuItem value="initial">initial</MenuItem>
            <MenuItem value="inherit">inherit</MenuItem>
            <MenuItem value="min-content">min-content</MenuItem>
            <MenuItem value="max-content">max-content</MenuItem>
            <MenuItem value="fit-content">fit-content</MenuItem>

          </Select>
          <TextField
            name="value"
            value={this.state.value}
            onChange={this.handleValue}
            disabled={this.state.format !== 'value'}
          />
          <Select
            value={this.state.units}
            onChange={this.handleUnits}
            disabled={this.state.format !== 'value'}
          >
            <MenuItem value="%">%</MenuItem>
            <MenuItem value="cm">cm</MenuItem>
            <MenuItem value="mm">mm</MenuItem>
            <MenuItem value="in">in</MenuItem>
            <MenuItem value="px">px</MenuItem>
            <MenuItem value="pt">pt</MenuItem>
            <MenuItem value="em">em</MenuItem>
            <MenuItem value="ch">ch</MenuItem>
            <MenuItem value="rem">rem</MenuItem>
            <MenuItem value="vw">vw</MenuItem>
            <MenuItem value="vh">vh</MenuItem>
          </Select>
        </Popover>
      </div>
    )
  }
}


export default withStyles(styles)(DimensionSlider);