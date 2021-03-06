/**
 * LoginReducer exports reducers which is a function that determines changes to an application's state.
 * 
 * @module LoginReducer
 * @author Chen En
 * @category Reducer
 */

import { 
    LOG_IN_USER,
    LOG_OUT_USER,
    REPOPULATE_STATE,
    TOGGLE_UNSAVED_STATE
} from '../actions/LoginAction';

/** 
 * string representing guest user.
 * 
 * @type {string}
 * @member GUEST
 */
export const GUEST = "Guest"

/**
 * string representing absent user.
 * 
 * @type {string}
 * @member MISSING
 */
 export const MISSING = ''

/** 
 * state that the login reducer is initialized with.
 * 
 * @typedef initialState
 * @property {boolean} loggedIn - logged in status of user.
 * @property {string} name - Github name of user.
 * @property {string} id - Unique Github id of user.
 * @property {string} avatar_url - url representing image of user's Github avatar
 * @property {string} gravatar_id - url representing user's globally recognized avatar
 * @property {Object} error - error response provided by requests.
 * @member initialState
 */
const initialState = {
    loggedIn: false,
    name: GUEST,
    id: MISSING,
    avatar_url: MISSING,
    gravatar_id: MISSING,
    error: null,
    unsaved: false
}

//TODO handle actions for GUEST

/**
 * A reducer function that maintains and changes the initialState 
 * by processing actions dispatched to it.
 * 
 * @param {Object} [state=initialState] - initialState is fixed.
 * @param {Object} action - Action object.
 * @return void 
 * @member login
 * @function
 */
export default function login(state = initialState, action) {
    switch(action.type) {
        case LOG_IN_USER:
            return {
                ...state,
                name: action.payload.name,
                id: action.payload.id,
                avatar_url: action.payload.avatar_url,
                gravatar_id: action.payload.gravatar_id,
                loggedIn: true
            }
        case LOG_OUT_USER:
            return {
                ...state,
                name: GUEST,
                id: MISSING,
                avatar_url: MISSING,
                gravatar_id: MISSING,
                loggedIn: false
            }
        case REPOPULATE_STATE:
            return {
                ...state,
                loggedIn: action.payload.loggedIn,
                name: action.payload.name,
                id: action.payload.id,
                avatar_url: action.payload.avatar_url,
                gravatar_id: action.payload.gravatar_id
            }
        case TOGGLE_UNSAVED_STATE:
            return {
                ...state,
                unsaved: action.payload.bool
            }
        default:
            return state
    }
}