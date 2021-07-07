/**
 * ErrorAction exports actions and their respective action creators.
 * 
 * @module ErrorAction
 * @author Chen En
 * @category Error
 */

/**
 * string that identifies a ADD_ERROR action.
 * 
 * @type {string}
 * @member ADD_ERROR
 */
export const ADD_ERROR = "ADD_ERROR";

/**
 * string that identifies a REMOVE_ERROR action.
 * 
 * @type {string}
 * @member REMOVE_ERROR
 */
export const REMOVE_ERROR = "REMOVE_ERROR";

/**
 * ADD_ERROR action creator. This action saves error to Redux Store.
 * If error is not request related, do not provide status argument.
 * 
 * @param {string} message - error message
 * @param {number} [status] - error status for request errors
 * @returns {{type: string, payload: Object}} - ADD_ERROR action object.
 * @member add_error
 * @function
 */
export const add_error = (message, status) => ({
    type: ADD_ERROR,
    payload: status !== undefined ? { status: status, message: message } : { message: message }
})

/**
 * REMOVE_ERROR action creator. This action removes error from Redux Store
 * 
 * @param {boolean} isStatus - boolean indicating if error is a request error.
 * @returns {{type: string, payload: Object}} - REMOVE_ERROR action object.
 * @member remove_error
 * @function
 */
 export const remove_error = (isStatus) => ({
    type: REMOVE_ERROR,
    payload: { isStatus: isStatus }
})