/**
 * LoginAction exports actions and their respective action creators.
 * 
 * @module actions/LoginActions
 * @author Chen En
 * @category Action
 */

/**
 * string that identifies a LOG_IN_USER action.
 * 
 * @type {string}
 * @member LOG_IN_USER
 */
export const LOG_IN_USER = "LOG_IN_USER"

/**
 * string that identifies a LOG_OUT_USER action.
 * 
 * @type {string}
 * @member LOG_OUT_USER
 */
export const LOG_OUT_USER = "LOG_OUT_USER"

/**
 * string that identifies a REPOPULATE_STATE action.
 * 
 * @type {string}
 * @member REPOPULATE_STATE
 */
export const REPOPULATE_STATE = "REPOPULATE_STATE"

/**
 * LOG_IN_USER action creator. This action saves user details contained in res to Redux Store and
 * sets boolean loggedIn in Redux Store to true.
 * 
 * @param {Object} res - response object containing Github user details.
 * @returns {{type: string, payload: Object}} - LOG_IN_USER action object.
 * @member log_in_user
 * @function
 */
export const log_in_user = res => ({
    type: LOG_IN_USER,
    payload: { ...res }
})

/**
 * LOG_OUT_USER action creator. This action removes user details contained in Redux Store and
 * sets boolean loggedIn in Redux Store to false.
 * 
 * @returns {{type: string}} - LOG_OUT_USER action object.
 * @member log_out_user
 * @function
 */
export const log_out_user = () => ({
    type: LOG_OUT_USER
})

/**
 * REPOPULATE_STATE action creator. This action saves user details and user logged in status
 * contained in res to Redux Store.
 * 
 * @param {Object} res - response object containing Github user details
 * @returns {{type: string, payload: Object}} - REPOPULATE_STATE action object.
 * @member repopulate_state
 * @function
 */
export const repopulate_state = res => ({
    type: REPOPULATE_STATE,
    payload: { ...res }
})