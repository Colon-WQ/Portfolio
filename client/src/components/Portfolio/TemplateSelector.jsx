import React, { Component } from 'react';
import { connect } from 'react-redux';
import { manualNext } from '../../actions/TourAction';
import { withStyles } from '@material-ui/core/styles';
import { Typography, Dialog, Tab, Tabs, ButtonBase, Card, CardMedia, CardContent, Fab } from '@material-ui/core';
import { templates } from '../../templates/Templates';
import { FaTimes, FaPlus } from 'react-icons/fa';


/**
 * @file User Interface to allow users to pick a template for their portfolios
 * 
 * @author Chuan Hao
 * 
 * @see TemplateSelector
 */

/**
 * Style generator to dynamically adjust styles based on theme provided
 * @param theme 
 * @returns classes passed as props to the component, with values provided by parameter theme
 */
const styles = (theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '2%',
    textAlign: 'center',
    backgroundColor: theme.palette.background.default,
    opacity: '85%',
    height: '100%',
    overflowX: 'hidden',
    overflowY: 'auto'
  },
  dialog: {
    overflowX: 'hidden',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    padding: '5vh',
    height: '100%'
  },
  buttonBase: {
    width: '100%',
    height: '100%',
    flexDirection: 'column'
  },
  card: {
    width: 345,
    minHeight: 200,
    display: 'flex',
    flexDirection: 'column'
  },
  cardMedia: {
    maxHeight: 200,
    overflow: 'hidden'
  },
  fab: {
    marginTop: 'auto',
    marginLeft: 'auto'
  },
  cardDiv: {
    display: 'grid',
    width: '100%',
    gridTemplateColumns: 'repeat(auto-fill, 345px)',
    gridGap: '55px',
    justifyContent: 'center',
    overflowY: 'auto'
  },
  buttonText: {
    marginLeft: '0.25rem'
  },
  fabMain: {
    marginLeft: '0.5rem'
  }
})

/**
 * User interface to allow users to select templates for each entry.
 * 
 * @component
 */
class TemplateSelector extends Component {
  /**
   * Populates state with fields passed in as attribute fields.
   * @constructor
   */
  constructor(props) {
    super(props);
    this.state = {
      showSelector: false,
      type: "introduction",
      style: 0
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleCloseSelector = this.handleCloseSelector.bind(this);
  }


  /**
   * Event handler to update states to reflect the selected category.
   * 
   * @param {*} event 
   * @param {string} newValue The category of entries selected.
   */
  handleChange(event, newValue) {
    this.setState({
      type: newValue
    });
  }

  /**
   * Event handler to create the selected entry.
   * 
   * @param {number} id The index of the selected style.
   */
  handleSelect(id) {
    this.handleCloseSelector({
      type: this.state.type,
      style: id
    })
  }

  handleCloseSelector(values) {
    //To manually increment step for product tour
    if (this.props.isTourRunning) {
      this.props.manualNext(2);
    }

    if (values !== undefined) {
      this.props.onClose(values)
    }
    this.setState({
      showSelector: false
    })
  }

  // MODAL TAKES IN A SINGLE JSX ELEMENT
  render() {
    const { classes } = this.props;
    // TODO: change name/id to field-name-id to avoid collision i.e. colours-primary-0
    return (
      <div>
        <Fab
          id='add-template-button'
          className={classes.fabMain}
          variant="extended"
          onClick={() => this.setState({ showSelector: true })}>
          <FaPlus />
          <Typography variant="body2" component="body2" className={classes.buttonText}>New Entry</Typography>
        </Fab>
        <Dialog className={classes.dialog}
          open={this.state.showSelector}
          maxWidth="xl"
          fullScreen
          onClose={() => this.handleCloseSelector()}
          aria-labelledby="Template Selector"
          aria-describedby="Select a template."
        >
          <div className={classes.root}>
            <Tabs
              value={this.state.type}
              onChange={this.handleChange}
              variant="scrollable"
              scrollButtons="auto"
            >
              {Object.keys(templates).map((type) => {
                return (<Tab label={type} value={type} />)
              })}
            </Tabs>
            <div className={classes.cardDiv}>
              {
                templates[this.state.type].map((entry, index) => {
                  return (<Card className={classes.card}>
                    <ButtonBase
                      focusRipple
                      key={index}
                      className={classes.buttonBase}
                      // focusVisibleClassName={}
                      onClick={() => this.handleSelect(index)}
                      name={index}
                    >
                      <CardMedia
                        component="img"
                        alt={entry.name}
                        image={entry.preview}
                        title={entry.name}
                        className={classes.cardMedia}
                      />
                      <CardContent>
                        <Typography>{entry.name}</Typography>
                      </CardContent>
                    </ButtonBase>
                  </Card>)
                })
              }
            </div>
            <Fab variant="extended" onClick={() => this.handleCloseSelector()} className={classes.fab}>
              <FaTimes />
                CANCEL
              </Fab>
          </div>
        </Dialog>
      </div>
    )
  }
}


/**
 * Function that maps variables from Redux Store to Home component's props.
 *
 * @param {Object} state - Redux Store
 * @memberof TemplateSelector
 */
const mapStateToProps = state => ({
  loggedIn: state.login.loggedIn,
  isTourRunning: state.tour.run
})

/** 
 * Provides action creators to Home component's props.
 * 
 * @type {Object.<Function>} 
 * @memberof TemplateSelector
 */
const mapDispatchToProps = {
  manualNext
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(TemplateSelector))