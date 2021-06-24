import { log_out_user } from '../actions/LoginAction';
import store from '../index';

/**
 * LoginAction exports actions and their respective action creators.
 * 
 * @module errorHandler
 * @author Chen En
 * @category Auxiliary Functions
 */

/**
 * A standardized error handler to handle errors from requests to backend. 
 * If error.response.status is 401 and err.response.data is "authorized user", it means that
 * the user is not signed in. User details will be removed from localStorage and a LOG_OUT_USER action will
 * be dispatched. The user will then be redirected to the home page to login again.
 * 
 * @param {Object} err error object
 * @param {Object} history history object
 * @returns void
 * @member handleErrors
 * @function
 */
export const handleErrors = async (err, history) => {
    if (err.response) {
        console.log(err.response.data);
        if (err.response.status === 401 && err.response.data === 'unauthorized user') {
            localStorage.removeItem(process.env.REACT_APP_USER_LOCALSTORAGE);
            store.dispatch(log_out_user());
            history.push('/');
        }
    } else {
        console.log(err.message);
    }
}