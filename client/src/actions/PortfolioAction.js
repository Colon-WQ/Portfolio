/**
 * PortfolioAction exports actions and their respective action creators.
 * 
 * @module PortfolioAction
 * @author Chen En
 * @category Action
 */

import axios from 'axios'

/**
 * string that identifies a FETCH_PORTFOLIOS_BEGIN action
 * 
 * @type {string}
 * @member FETCH_PORTFOLIOS_BEGIN
 */
export const FETCH_PORTFOLIOS_BEGIN = "FETCH_PORTFOLIOS_BEGIN"

/**
 * string that identifies a FETCH_PORTFOLIOS_SUCCESS action
 * 
 * @type {string}
 * @member FETCH_PORTFOLIOS_SUCCESS
 */
export const FETCH_PORTFOLIOS_SUCCESS = "FETCH_PORTFOLIOS_SUCCESS"

/**
 * string that identifies a FETCH_PORTFOLIOS_FAILURE action
 * 
 * @type {string}
 * @member FETCH_PORTFOLIOS_FAILURE
 */
export const FETCH_PORTFOLIOS_FAILURE = "FETCH_PORTFOLIOS_FAILURE"

/**
 * string that identifies a SAVE_CURRENT_WORK action
 * 
 * @type {string}
 * @member SAVE_CURRENT_WORK
 */
export const SAVE_CURRENT_WORK = "SAVE_CURRENT_WORK"

/**
 * string that identifies a CLEAR_CURRENT_WORK action
 * 
 * @type {string}
 * @member CLEAR_CURRENT_WORK
 */
export const CLEAR_CURRENT_WORK = "CLEAR_CURRENT_WORK"

/**
 * SAVE_CURRENT_WORK action creator. This action saves user's current portfolio work
 * to localStorage.
 * 
 * @param {Object} curr - object containing user's current portfolio work.
 * @returns {{type: string, payload: Object}} - SAVE_CURRENT_WORK action object.
 * @member saveCurrentWork
 * @function
 */
export const saveCurrentWork = curr => ({
    type: SAVE_CURRENT_WORK,
    payload: { curr }
})

/**
 * CLEAR_CURRENT_WORK action creator. This action clears user's current portfolio work
 * from localStorage.
 * 
 * @returns {{type: string}} - CLEAR_CURRENT_WORK action object.
 * @member clearCurrentWork
 * @function
 */
export const clearCurrentWork = () => ({
    type: CLEAR_CURRENT_WORK
})

/**
 * Action creator that returns a function, which is only possible with redux-thunk.
 * 
 * The function receives the store's dispatch method, which is then used to dispatch regular
 * synchronous actions inside the function's body once the asynchronous operations have been completed.
 * 
 * The function saves user's work to localStorage, then dispatches a SAVE_CURRENT_WORK action object.
 *
 * @param {Object} curr - object containing user's current portfolio work.
 * @return {Function} - a function that receives the store's dispatch method.
 * @member saveCurrentWorkToLocal
 * @function
 * @requires NPM:redux-thunk
 */
export function saveCurrentWorkToLocal(curr) {
    return dispatch => {
        window.localStorage.setItem(process.env.REACT_APP_AUTOSAVE_LOCALSTORAGE, JSON.stringify(curr))
        dispatch(saveCurrentWork(curr))
        //console.log("portfolio work saved temporarily")
    }
}

/**
 * Action creator that returns a function, which is only possible with redux-thunk.
 * 
 * The function receives the store's dispatch method, which is then used to dispatch regular
 * synchronous actions inside the function's body once the asynchronous operations have been completed.
 * 
 * The function removes user's work from localStorage, then dispatches a CLEAR_CURRENT_WORK action object.
 *
 * @return {Function} - a function that receives the store's dispatch method.
 * @member clearCurrentWorkToLocal
 * @function
 * @requires NPM:redux-thunk
 */
export function clearCurrentWorkFromLocal() {
    return dispatch => {
        window.localStorage.removeItem(process.env.REACT_APP_AUTOSAVE_LOCALSTORAGE)
        dispatch(clearCurrentWork())
        //console.log("portfolio work cleared")
    }
}

/**
 * FETCH_PORTFOLIOS_BEGIN action creator. This action sets boolean loading in Redux Store to true.
 * 
 * @returns {{type: string}} - FETCH_PORTFOLIOS_BEGIN action object.
 * @member fetchPortfoliosBegin
 * @function
 */
export const fetchPortfoliosBegin = () => ({
    type: FETCH_PORTFOLIOS_BEGIN
})

/**
 * FETCH_PORTFOLIOS_SUCCESS action creator. This action sets boolean loading in Redux Store to false.
 * Then saves the user's portfolios fetched from mongoDB to Redux Store.
 * 
 * @param {Object} portfolios - response object containing user's portfolios.
 * @returns {{type: string, payload: Object}} - FETCH_PORTFOLIOS_SUCCESS action object.
 * @member fetchPortfoliosSuccess
 * @function
 */
export const fetchPortfoliosSuccess = portfolios => ({
    type: FETCH_PORTFOLIOS_SUCCESS,
    payload: { portfolios }
})

/**
 * FETCH_PORTFOLIOS_FAILURE action creator. This actions sets boolean loading in Redux Store to false.
 * Then sets err in Redux Store to error object obtaining from request failure.
 * 
 * @param {Object} err - error object containing details about request failure.
 * @returns {{type: string, payload: Object}} = FETCH_PORTFOLIOS_FAILURE action object.
 * @member fetchPortfoliosFailure
 * @function
 */
export const fetchPortfoliosFailure = err => ({
    type: FETCH_PORTFOLIOS_FAILURE,
    payload: { err }
})

//Redux thunk allows dispatch actions that return a function. This function must take in user id
/**
 * Action creator that returns a function, which is only possible with redux-thunk.
 * 
 * The function receives the store's dispatch method, which is then used to dispatch regular
 * synchronous actions inside the function's body once the asynchronous operations have been completed.
 * 
 * The function dispatches a FETCH_PORTFOLIOS_BEGIN action, then starts a GET request to obtain
 * a user's portfolio by its id. If the request succeeds, the function then dispatches a
 * FETCH_PORTFOLIOS_SUCCESS action. Otherwise, it dispatches a FETCH_PORTFOLIOS_FAILURE action.
 *
 * @param {string} id - id of user whose portfolios are to be fetched from mongoDB.
 * @return {Function} - a function that receives the store's dispatch method.
 * @member fetchPortfolios
 * @function
 * @requires NPM:redux-thunk
 */
export function fetchPortfolios(id) {
    return dispatch => {
        dispatch(fetchPortfoliosBegin());
        return axios({
            method: 'GET',
            url: process.env.REACT_APP_BACKEND + "/portfolio",
            withCredentials: true,
            params: {
                id: id
            }
        }).then(res => res.data)
        .then(data => {
            //TODO PROBABLY HAVE TO CONVERT DATA INTO AN ARRAY DEPENDING ON THE RESULT
            if (data.portfolios !== undefined) {
                dispatch(fetchPortfoliosSuccess(data.portfolios))
            } 
        }).catch(err => dispatch(fetchPortfoliosFailure(err)))
    }
}