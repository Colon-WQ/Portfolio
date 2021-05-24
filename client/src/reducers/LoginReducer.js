/**
 * login.reducer.js exports reducers which is a function that determines changes to an application's state.
 * 
 * @module reducers/login
 * @author Chen En
 * @category Reducer
 */

import { 
    LOG_IN_USER,
    LOG_OUT_USER,
    REPOPULATE_STATE
} from '../actions/login.action';

/** 
 * string representing guest user.
 * 
 * @type {string}
 * @member GUEST
 */
const GUEST = "Guest"

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
    id: '',
    avatar_url: '',
    gravatar_id: '',
    error: null
}

/**
 * string representing absent user.
 * 
 * @type {string}
 * @member MISSING
 */
export const MISSING = ''

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
        default:
            return state
    }
}