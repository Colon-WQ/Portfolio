import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { repopulate_state } from '../actions/LoginAction';
import { fetchPortfolios, saveCurrentWorkToLocal, clearCurrentWorkFromLocal } from '../actions/PortfolioAction';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CardActions from '@material-ui/core/CardActions';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { withRouter } from 'react-router-dom';
import { BeatLoader } from 'react-spinners';
import { FaRegEdit } from 'react-icons/fa';
import { handleErrors } from '../handlers/errorHandler';

/**
 * @file Dashboard component displays previews of the user's portfolios and offers 
 * functionalities that allow creation of new user portfolios.
 * 
 * @author Chen En
 * @author Chuan Hao
 * 
 * @see Dashboard
 */

/**
 * Style generator to dynamically adjust styles based on theme provided
 * 
 * @memberof Dashboard
 * @param {Object} theme 
 */
const styles = (theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'start',
    alignItems: 'center',
    margin: 'auto'
  },
  portfolioButton: {
    variant: 'contained',
    size: 'small',
    color: 'primary'
  },
  cardRoot: {
    margin: theme.spacing(1),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardDetails: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  cardControls: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  cardMedia: {
    width: 151,
    height: 151,
  },
  cardGap: {
    width: '15vh'
  },
  portfolioMenu: {
    display: "inline-block"
  },
  portfolioMenuItem: {
    display: "inline"
  },
  textPrimaryColor: {
    color: theme.palette.text.primary
  },
  appBarSpacer: theme.mixins.toolbar
});

/**
 * The dashboard logged in users will use to navigate the page
 * 
 * @component
 */
class Dashboard extends Component {

  constructor() {
    super();
    this.state = {
      nameDialogState: false,
      portfolioName: "MyPortfolio",
      duplicateKeyError: false,
      duplicateKeyHelperText: "",
      anchorEl: null,
      currentPortfolio_Id: "",
      deleteDialogState: false,
      changeNameDialogState: false,
      changedName: "",
      images: {},
      defaultPreviewSrc: "https://cdn.dribbble.com/users/200733/screenshots/15094543/media/fb4bf141f17b05df82f77926d94ccd6d.png"
    }

    this.handleAddPortfolio = this.handleAddPortfolio.bind(this);
    this.handleOpenPortfolio = this.handleOpenPortfolio.bind(this);
    this.handleOnChange = this.handleOnChange.bind(this);
    this.handleNameDialog = this.handleNameDialog.bind(this);
    this.handleDeletePortfolio = this.handleDeletePortfolio.bind(this);
    this.handleOpenEditMenu = this.handleOpenEditMenu.bind(this);
    this.handleCloseEditMenu = this.handleCloseEditMenu.bind(this);
    this.handleDeleteDialogState = this.handleDeleteDialogState.bind(this);
    this.handleChangeNameDialogState = this.handleChangeNameDialogState.bind(this);
    this.handleChangePortfolioName = this.handleChangePortfolioName.bind(this);
    this.handleGetImage = this.handleGetImage.bind(this);
    this.handleDeleteImage = this.handleDeleteImage.bind(this);
  }

  /**
   * Attempts to fetch user details and logged in status from localStorage after component is rendered.
   * 
   * repopulateState takes a while to run, so it is necessary to await it, then fetchPortfolios again.
   * 
   * @return void
   * @memberof Dashboard
   */
  async componentDidMount() {
    
      const localStorageItem = await JSON.parse(window.localStorage.getItem(process.env.REACT_APP_USER_LOCALSTORAGE));
      if (localStorageItem !== null) {
        await this.props.repopulate_state(localStorageItem);
      }


      if (this.props.loggedIn) {
        await this.props.fetchPortfolios(this.props.id);

        this.props.portfolios.map(portfolio => this.handleGetImage(portfolio._id));
      }
      
  }

  /**
   * Testing purposes only
   * 
   * @param {*} e unused
   * @ignore
   */
  checkCookie(e) {
    console.log('testing cookie');
    axios({
      method: "GET",
      url: process.env.REACT_APP_BACKEND + '/portfolio/status',
      withCredentials: true
    }).then(res => {
      console.log("authorized")
      console.log(res.data)
    });
  }

  /**
   * Handles changes in change name dialog textfield. Also resets any errors due to duplicate or empty name input.
   * 
   * @param {Object} event 
   * @returns void
   * @memberof Dashboard
   */
  handleOnChange(event) {
    this.setState({
      duplicateKeyError: false,
      duplicateKeyHelperText: ""
    })
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  /**
   * Handles the opening and closing of name dialog for setting new portfolio names.
   * 
   * @param {boolean} bool boolean indicating state of name dialog. true to show and false to hide.
   * @returns void
   * @memberof Dashboard
   */
  handleNameDialog(bool) {
    this.setState({
      nameDialogState: bool
    });
  }

  /**
   * Handles the opening and closing of delete portfolio dialog for deleting portfolios. If true, delete dialog will be set to open.
   * Edit menu will be set to hide. If false, delete dialog will hide and the portfolio name, error boolean and error message will be reset.
   *
   * @param {boolean} bool boolean indicating state of delete dialog. true to show and false to hide.
   * @returns void
   * @memberof Dashboard
   */
  handleDeleteDialogState(bool) {
    if (bool) {
      this.handleCloseEditMenu();
    } else {
      //after closing dialog, need to reset error, error text and the relevant text field
      this.setState({
        portfolioName: "",
        duplicateKeyError: false,
        duplicateKeyHelperText: ""
      });
    }
    this.setState({
      deleteDialogState: bool
    });
  }

  /**
   * Checks for duplicate and empty Portfolio names. Then saves selected Portfolio name to localStorage and redux state. 
   * Then if portfolio name passes check, changes route to /edit to render a fresh Portfolio creation screen.
   * Otherwise, error will be indicated and appropriate error message will be set.
   * 
   * @return void
   * @memberof Dashboard
   */
  handleAddPortfolio() {
    if (this.state.portfolioName === "") {
      this.setState({
        duplicateKeyError: true,
        duplicateKeyHelperText: "Portfolio name cannot be empty"
      })
    } else {
      if (this.props.portfolios.filter(portfolio => portfolio.name === this.state.portfolioName).length === 0) {
        //This clears current work from local, so we need to arrest the screen whenever user attempts to leave a portfolio
        //page and remind him to save before leaving.
        this.props.clearCurrentWorkFromLocal();

        const portfolio = {
          _id: undefined,
          name: this.state.portfolioName,
          pages: undefined
        }

        this.props.saveCurrentWorkToLocal(portfolio);
        this.props.history.push("/edit");
      } else {
        this.setState({
          duplicateKeyError: true,
          duplicateKeyHelperText: "Portfolio name already exists"
        })
      }
    }

  }

  /**
   * Fetches the requested portfolio from mongoDB, then saves it to localStorage and redux state.
   * Then changes route to /edit to render the Portfolio.
   * 
   * @param {Object} event
   * @return void
   * @memberof Dashboard
   */
  async handleOpenPortfolio(event) {

    const id = event.currentTarget.id;

    await axios({
      method: "GET",
      url: process.env.REACT_APP_BACKEND + "/portfolio/" + id,
      withCredentials: true
    }).then(async res => {
      console.log(`portfolio ${res.data.portfolio.name} fetched`);
      //Need to wait for portfolio to be saved to localStorage before changing route
      //Since the website is public anyways, portfolio data is meant to be public and thus not considered sensitive.
      //LocalStorage is suitable to store portfolio data.
      await this.props.saveCurrentWorkToLocal(res.data.portfolio);

      this.props.history.push("/edit");
    }).catch(err => {
      handleErrors(err, this.props.history);
    });
  }

  /**
   * Handles the deletion of portfolio from mongodb as well as attached images.
   * Then sets delete dialog to hide.
   *
   * @returns void
   * @memberof Dashboard
   */
  async handleDeletePortfolio() {
    await axios({
      method: "DELETE",
      url: process.env.REACT_APP_BACKEND + "/portfolio/delete/" + this.state.currentPortfolio_Id,
      withCredentials: true
    }).then(async res => {
      console.log(res.data.message);
      await this.props.fetchPortfolios(this.props.id);

      //deletes all images related to said portfolio
      for (let key of Object.keys(this.state.images[this.state.currentPortfolio_Id])) {
        await this.handleDeleteImage(key);
      }

      const temp = this.state.images;
      delete temp[this.state.currentPortfolio_Id];
      this.setState({
        images: temp
      });

    }).catch(err => {
      handleErrors(err, this.props.history);
    })

    this.handleDeleteDialogState(false);
  }

  /**
   * Handles the opening of edit menu for a portfolio. Also sets the state field currentPortfolio_Id to the selected Portfolio's _id.
   * 
   * @param {Object} event
   * @return void
   * @memberof Dashboard
   */
  handleOpenEditMenu(event) {
    this.setState({
      anchorEl: event.currentTarget,
      currentPortfolio_Id: event.currentTarget.id
    });
  }

  /**
   * Handles the closing of edit menu for a portfolio. Does not reset the currentPortfolio_Id since it could be used in changing
   * portfolio name or deleting portfolio.
   * 
   * @return void
   * @memberof Dashboard
   */
  handleCloseEditMenu() {
    this.setState({
      anchorEl: null
    });
  }

  /**
   * Handles the opening and closing of change name dialog for changing portfolio name. If true, closes edit menu. If false,
   * resets changedName, error boolean and error message.
   * 
   * @param {boolean} bool boolean indicating state of change name dialog. true to show and false to hide.
   * @returns void
   * @memberof Dashboard
   */
  handleChangeNameDialogState(bool) {
    if (bool) {
      this.handleCloseEditMenu();
    } else {
      //after closing dialog, need to reset error, error text and the relevant text field
      this.setState({
        changedName: "",
        duplicateKeyError: false,
        duplicateKeyHelperText: ""
      });
    }

    this.setState({
      changeNameDialogState: bool
    });
  }

  //currentPortfolio_Id will be set to the _id of the selected portfolio when menu is opened, so once in the dialog,
  //currentPortfolio_Id will be the correct one.

  /**
   * Checks for duplicate or empty portfolio name. If check passes, a request will be made to backend to change portfolio name.
   * If check fails, error boolean will be set to true and appropriate error message will be set.
   * 
   * @returns void
   * @memberof Dashboard
   */
  async handleChangePortfolioName() {
    if (this.state.changedName === "") {
      this.setState({
        duplicateKeyError: true,
        duplicateKeyHelperText: "Portfolio name cannot be empty"
      });
    } else {
      if (this.props.portfolios.filter(portfolio => portfolio.name === this.state.changedName).length === 0) {
        const originalPortfolio = this.props.portfolios.find(element => element._id === this.state.currentPortfolio_Id);
        const changedPortfolio = { ...originalPortfolio };
        changedPortfolio.name = this.state.changedName;
        await axios({
          method: "PUT",
          url: process.env.REACT_APP_BACKEND + "/portfolio/updatePortfolio",
          withCredentials: true,
          data: {
            portfolio: changedPortfolio
          }
        }).then(res => {
          console.log(res.data.message);
        }).catch(err => {
          handleErrors(err, this.props.history);
        })

        await this.props.fetchPortfolios(this.props.id);
        this.handleChangeNameDialogState(false);

      } else {
        this.setState({
          duplicateKeyError: true,
          duplicateKeyHelperText: "Portfolio name already exists"
        });
      }
    }

  }

  /**
   * Takes in a string portfolio_id and first sends a request to backend to retrieve an array of _id representing image documents attached
   * to the portfolio. Then for each of these _ids, send a request to backend to retrieve the image. The image will then be added to
   * state object images.
   * 
   * @param {string} portfolio_id portfolio's _id
   * @returns void
   * @memberof Dashboard
   */
  async handleGetImage(portfolio_id) {
    await axios({
      method: "GET",
      url: process.env.REACT_APP_BACKEND + "/portfolio/getImageRefs/" + portfolio_id,
      withCredentials: true
    }).then(async res => {
      console.log(res.data.message);
      const imageRefs = res.data.images;
      const images = this.state.images;
      for (let imageRef of imageRefs) {
        await axios({
          method: "GET",
          url: process.env.REACT_APP_BACKEND + "/portfolio/getImage/" + portfolio_id,
          withCredentials: true,
          responseType: 'blob',
          params: {
            label: imageRef.label
          }
        }).then(res => {
          console.log(`image ${imageRef.label} fetched`);
          const temp = {};
          temp[imageRef.label] = URL.createObjectURL(res.data);
          images[portfolio_id] = temp;
        }).catch(err => {
          if (err.response) {
            console.log(err.response.data);
          } else {
            console.log(err.message);
          }
        })
      }

      this.setState({
        images: images
      });
    }).catch(err => {
      handleErrors(err, this.props.history);
    });
  }

  /**
   * Sends a request to backend to delete an image with given label that is attached to the portfolio with _id that is the state field currentPortfolio_id.
   * The image is then deleted from state object images.
   * 
   * @param {string} label image's label
   * @returns void
   * @memberof Dashboard
   */
  async handleDeleteImage(label) {
    await axios({
      method: "DELETE",
      url: process.env.REACT_APP_BACKEND + "/portfolio/deleteImage/" + this.state.currentPortfolio_Id,
      withCredentials: true,
      data: {
        label: label
      }
    }).then(res => {
      console.log(res.data.message);
      const temp = this.state.images
      const tempPortfolioImages = temp[this.state.currentPortfolio_Id];
      if (tempPortfolioImages !== undefined) {
        delete tempPortfolioImages[label];
        this.setState({
          images: temp
        });
      }
    }).catch(err => {
      handleErrors(err, this.props.history);
    });
  }


  render() {
    const { portfolios, classes } = this.props;

    return (
      <div className={classes.root}>
        <div className={classes.appBarSpacer} />
        <Typography variant="h2" component="h3">Here is your dashboard {this.props.name}!</Typography>
        <Grid container direction='row' justify='center' alignItems='center'>
          {
            this.props.loggedIn
              ?
              this.props.loading
                ?
                <BeatLoader />
                :
                this.props.error
                  ?
                  this.props.error.response.status === 404
                    ?
                    <Typography variant="h6">Create your first Portfolio!</Typography>
                    :
                    <Typography variant="h6">{this.props.error.message}</Typography>
                  :
                  portfolios.length === 0
                    ?
                    <Typography variant="h6">Oops. It appears that you have no saved Portfolios</Typography>
                    :
                    portfolios.map((element, idx) => {
                      return (
                        <Card
                          className={classes.cardRoot}
                          key={idx}
                        >
                          <div className={classes.cardDetails}>
                            <CardContent>
                              <Typography component="h5" variant="h5">{element.name}</Typography>
                            </CardContent>
                            <CardActions className={classes.cardControls}>
                              <Button
                                id={element._id}
                                className={classes.portfolioButton}
                                aria-controls="edit-menu"
                                aria-haspopup="true"
                                onClick={this.handleOpenEditMenu}
                              >
                                <FaRegEdit />
                              </Button>
                              <span className={classes.cardGap} />
                              <Button
                                id={element._id}
                                className={classes.portfolioButton}
                                onClick={this.handleOpenPortfolio}
                              >
                                Open
                                                              </Button>
                            </CardActions>
                          </div>

                          <CardMedia
                            component="img"
                            className={classes.cardMedia}
                            height='150'
                            width='150'
                            src={this.state.images[element._id] === undefined
                              ?
                              this.state.defaultPreviewSrc
                              :
                              this.state.images[element._id]["preview"] === undefined
                                ?
                                this.state.defaultPreviewSrc
                                :
                                this.state.images[element._id]["preview"]
                            }
                          />
                        </Card>

                      );
                    })
              :
              <Typography variant="h6">Please authorize to enable portfolio saving features.</Typography>
          }
        </Grid>
        <Button onClick={() => this.handleNameDialog(true)} className={classes.portfolioButton}>Add a Portfolio</Button>
        <Menu
          id="edit-menu"
          anchorEl={this.state.anchorEl}
          className={classes.portfolioMenu}
          keepMounted
          open={Boolean(this.state.anchorEl)}
          onClose={this.handleCloseEditMenu}
          getContentAnchorEl={null}
          anchorOrigin={{ vertical: 'center', horizontal: 'left' }}
          transformOrigin={{ vertical: 'center', horizontal: 'left' }}
        >
          <MenuItem className={classes.portfolioMenuItem} onClick={() => this.handleDeleteDialogState(true)}>Delete</MenuItem>
          <MenuItem className={classes.portfolioMenuItem} onClick={() => this.handleChangeNameDialogState(true)}>Change Name</MenuItem>
        </Menu>
        <Dialog
          open={this.state.nameDialogState}
          onClose={() => this.handleNameDialog(false)}
          aria-labelledby="portfolio name dialog"
          fullWidth
        >
          <DialogTitle id="portfolio-name-dialog-title">
            Portfolio Name
                    </DialogTitle>
          <DialogContent>
            <DialogContentText>
              Set your Portfolio name here.
                        </DialogContentText>
            <TextField
              name="portfolioName"
              autoFocus
              margin="dense"
              label="Portfolio Name"
              type="string"
              defaultValue={this.state.portfolioName}
              fullWidth
              onChange={this.handleOnChange}
              error={this.state.duplicateKeyError}
              helperText={this.state.duplicateKeyHelperText}
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => this.handleNameDialog(false)}
            >
              Cancel
                        </Button>
            <Button
              onClick={this.handleAddPortfolio}
            >
              Set Name
                        </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={this.state.deleteDialogState}
          onClose={() => this.handleDeleteDialogState(false)}
          aria-labelledby="delete-confirmation-dialog"
          aria-describedby="delete-confirmation-dialog"
          fullWidth
        >
          <DialogTitle id="delete-confirmation-title">Delete Portfolio Confirmation</DialogTitle>
          <DialogContent>
            <DialogContentText id="delete-confirmation-description" className={classes.textPrimaryColor}>
              Are you sure you want to delete this Portfolio? This action is irreversible and your portfolio will be deleted permanently.
                            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => this.handleDeleteDialogState(false)}>
              Cancel
                        </Button>
            <Button onClick={this.handleDeletePortfolio}>
              Delete
                        </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={this.state.changeNameDialogState}
          onClose={() => this.handleChangeNameDialogState(false)}
          aria-labelledby="change-name-dialog"
          aria-describedby="change-name-dialog"
          fullWidth
        >
          <DialogTitle id="change-name-dialog-title">Change Portfolio Name</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Type your new portfolio name here.
                            </DialogContentText>
            <TextField
              name="changedName"
              autoFocus
              margin="dense"
              label="New Portfolio Name"
              type="string"
              defaultValue={this.state.changedName}
              fullWidth
              onChange={this.handleOnChange}
              error={this.state.duplicateKeyError}
              helperText={this.state.duplicateKeyHelperText}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => this.handleChangeNameDialogState(false)}>
              Cancel
                            </Button>
            <Button onClick={this.handleChangePortfolioName}>
              Change
                            </Button>
          </DialogActions>
        </Dialog>
      </div>

    )
  }
}

/**
 * Function that maps variables from Redux Store to Home component's props.
 *
 * @param {Object} state - Redux Store
 * @memberof Dashboard
 */
const mapStateToProps = state => ({
  loggedIn: state.login.loggedIn,
  name: state.login.name,
  id: state.login.id,
  portfolios: state.portfolio.portfolios,
  loading: state.portfolio.loading,
  error: state.portfolio.error
});

/** 
 * Provides action creators to Home component's props.
 * 
 * @type {Object.<Function>} 
 * @memberof Dashboard
 */
const mapDispatchToProps = {
  repopulate_state,
  fetchPortfolios,
  saveCurrentWorkToLocal,
  clearCurrentWorkFromLocal
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(withRouter(Dashboard)));
