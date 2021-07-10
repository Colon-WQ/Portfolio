import React from 'react';
import { remove_error } from '../actions/ErrorAction';
import { useSelector } from 'react-redux';
import store from '../index';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import Button from '@material-ui/core/Button';
import { FaTimes } from 'react-icons/fa';
import { withStyles } from '@material-ui/styles';

/**
 * Style generator to dynamically adjust styles based on theme provided
 * 
 * @memberof ErrorDisplay
 * @param {Object} theme 
 */
 const styles = (theme) => ({
    errorSnackBar: {
        backgroundColor: theme.palette.error.main
    }
 })

const ErrorDisplay = (props) => {

    const requestError = useSelector((state) => state.error.requestErrors.length === 0 
        ? undefined
        : state.error.requestErrors[state.error.requestErrors.length - 1]);

    const error = useSelector((state) => state.error.errors.length === 0
        ? undefined
        : state.error.errors[state.error.errors.length - 1]);

    const handleClose = () => {
        if (requestError === undefined) {
            store.dispatch(remove_error(false));
        } else {
            store.dispatch(remove_error(true));
        }
    }

    const { classes } = props;

    if (requestError === undefined && error === undefined) {
        return <div/>
    } else {
        return (
            <Snackbar
                key="error snackbar"
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                open={true}
                autoHideDuration={3000}
                onClose={handleClose}
            >
                <SnackbarContent
                    className={classes.errorSnackBar}
                    message={requestError === undefined ? error : requestError.substring(3)}
                    action={
                        <React.Fragment>
                            <Button
                                onClick={handleClose}
                            >
                                <FaTimes color="white"/>
                            </Button>
                        </React.Fragment>
                    }
                />
            </Snackbar>
        )
    }
    
}

export default withStyles(styles)(ErrorDisplay);