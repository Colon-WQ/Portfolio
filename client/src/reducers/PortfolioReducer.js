/**
 * PortfolioReducer exports reducers which is a function that determines changes to an application's state.
 * 
 * @module PortfolioReducer
 * @author Chen En
 * @category Reducer
 */

import {
    FETCH_PORTFOLIOS_BEGIN,
    FETCH_PORTFOLIOS_SUCCESS,
    FETCH_PORTFOLIOS_FAILURE,
    SAVE_CURRENT_WORK,
    CLEAR_CURRENT_WORK
} from '../actions/PortfolioAction'

/** 
 * @typedef initialState
 * @property {Array.<Object>} portfolios - Array containing objects containing details about user portfolios.
 * @property {boolean} loading - boolean indicating loading status
 * @property {Object} error - error object from a failed request
 * @property {Object} currentWork - object containing details about user's current portfolio work.
 * @member initialState
 */
const initialState = {
    portfolios: [],
    loading: false,
    error: null,
    currentWork: null
}

/**
 * A reducer function that maintains and changes the initialState 
 * by processing actions dispatched to it.
 * 
 * @param {Object} [state=initialState] - initialState is fixed.
 * @param {Object} action - Action object.
 * @return void 
 * @member portfolio
 * @function
 */
export default function portfolio(state = initialState, action) {
    switch(action.type) {
        case FETCH_PORTFOLIOS_BEGIN:
            return {
                ...state,
                loading: true
            }
        case FETCH_PORTFOLIOS_SUCCESS:
            return {
                ...state,
                loading: false,
                portfolios: action.payload.portfolios
            }
        case FETCH_PORTFOLIOS_FAILURE:
            //if failure, means user is unauthorized. clear portfolios and current_work
            return {
                ...state,
                loading: false,
                portfolios: [],
                currentWork: null,
                error: action.payload.err
            }
        case SAVE_CURRENT_WORK:
            return {
                ...state,
                currentWork: action.payload.curr
            }
        case CLEAR_CURRENT_WORK:
            return {
                ...state,
                currentWork: null
            }
        default:
            return state;
    }
}