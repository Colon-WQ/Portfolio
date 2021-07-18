import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Button, TextField, Typography, MenuItem, Popover, Select, Tooltip } from '@material-ui/core';
import { FaInfoCircle } from 'react-icons/fa';

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
  mainDiv: {
    padding: '10px',
    display: 'flex',
    flexDirection: 'column'
  },
  rowDiv: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'left',
    textAlign: 'center',
    alignItems: 'center'
  },
  tooltipDiv: {
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'left'
  }
});

const formats = ['auto',
  'initial',
  'inherit',
  'min-content',
  'max-content',
  'fit-content'];

class DimensionSlider extends Component {
  /**
   * Populates state with fields passed in as attribute fields.
   * @constructor
   */
  constructor(props) {
    super(props);
    const isValue = !formats.includes(this.props.defaultValue);
    const regex = isValue ? this.props.defaultValue.match(/(-?[\d.]+)([a-z%]*)/) : null;

    this.state = {
      units: isValue ? regex[2] : '%',
      value: isValue ? regex[1] : 100,
      format: isValue ? 'value' : this.props.defaultValue,
      showSlider: false,
      anchorEl: null,
    }
    this.handleClose = this.handleClose.bind(this);
    this.handleFormat = this.handleFormat.bind(this);
    this.handleValue = this.handleValue.bind(this);
    this.handleUnits = this.handleUnits.bind(this);

    this.buttonRef = React.createRef();
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
        <div className={classes.rowDiv}>
          <Typography>
            {this.props.label}
          </Typography>
          <Button
            ref={this.buttonRef}
            onClick={(event) => this.setState({ showSlider: true, anchorEl: event.target })}
          >
            {
              this.state.format === 'value'
                ? `${this.state.value}${this.state.units}`
                : this.state.format
            }
          </Button>
        </div>
        <Popover
          open={Boolean(this.state.anchorEl) && this.state.showSlider}
          anchorEl={this.state.anchorEl}
          transformOrigin={{ vertical: "center", horizontal: "center" }}
          onClose={() => {
            this.handleClose(
              true,
              this.state.format === 'value'
                ? `${this.state.value}${this.state.units}`
                : this.state.format
            )
            this.setState({ showSlider: false, anchorEl: null })
          }}
          placement="bottom"
        >
          <div className={classes.mainDiv}>
            <Tooltip title={
              <div className={classes.tooltipDiv}>
                <Typography variant="body1" component="body1"><b>Auto: </b>Default length derived from browser</Typography>
                <Typography variant="body1" component="body1"><b>Initial: </b>The default value for the element</Typography>
                <Typography variant="body1" component="body1"><b>Inherit: </b>Takes the parent values</Typography>
                <Typography variant="body1" component="body1"><b>Min-Content: </b>The minimum length that does not cause overflow</Typography>
                <Typography variant="body1" component="body1"><b>Max-Content: </b>The maximum length that element can take up</Typography>
                <Typography variant="body1" component="body1"><b>Fit-Content: </b>The maximum length that does not cause overflow</Typography>
                <Typography variant="body1" component="body1"><b>Value: </b>Fixed percentage/unit length</Typography>
                <Typography variant="body2" component="body2">{'  '}<b>Units:</b></Typography>
                <Typography variant="body2" component="body2">{'  '}%: The percentage of parent length to occupy</Typography>
                <Typography variant="body2" component="body2">{'  '}em: A unit relative to font size of the current element</Typography>
                <Typography variant="body2" component="body2">{'  '}rem: A unit relative to the root font size</Typography>
                <Typography variant="body2" component="body2">{'  '}ch: The unit length of a character</Typography>
                <Typography variant="body2" component="body2">{'  '}vw: % of the full browser width</Typography>
                <Typography variant="body2" component="body2">{'  '}vh: % of the full browser height</Typography>
              </div>
            }>
              <div style={{ marginLeft: 'auto' }}>
                <FaInfoCircle />
              </div>
            </Tooltip>
            <div className={classes.rowDiv}>
              <Typography component="body1" variant="body1">Value: </Typography>
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
            </div>
            <div className={classes.rowDiv}>
              <Typography component="body1" variant="body1">Amount: </Typography>
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
                <MenuItem value="rem">rem</MenuItem>
                <MenuItem value="ch">ch</MenuItem>
                <MenuItem value="vw">vw</MenuItem>
                <MenuItem value="vh">vh</MenuItem>
              </Select></div>
          </div>
        </Popover>
      </div >
    )
  }
}


export default withStyles(styles)(DimensionSlider);