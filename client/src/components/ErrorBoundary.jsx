import React, { Component } from 'react';
import { add_error } from '../actions/ErrorAction';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/styles';
import { withRouter } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

const styles = (theme) => ({
  root: {
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: "column",
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '2%'
  },
  homeButton: {
    marginTop: '1%',
  }
});

class ErrorBoundary extends Component {
    constructor(props) {
      super(props);
      this.state = { hasError: false };
    }
  
    static getDerivedStateFromError(error) {
      // Update state so the next render will show the fallback UI.
      return { hasError: true };
    }
  
    componentDidCatch(error, errorInfo) {
      // You can also log the error to an error reporting service
      this.props.add_error(error.message);
    }
  
    render() {
      const { classes } = this.props;

      if (this.state.hasError) {
        // You can render any custom fallback UI
        return (
          <div className={classes.root}>
            <Typography variant="h3" component="h3">Something went wrong</Typography>
            <Button
              className={classes.homeButton}
              onClick={() => this.props.history.push('/')}
              variant="outlined"
            >
              Return to Home
            </Button>
          </div>
          )
      }
  
      return this.props.children; 
    }
}

const mapDispatchToProps = {
    add_error
}

export default connect(null, mapDispatchToProps)(withStyles(styles)(withRouter(ErrorBoundary)));