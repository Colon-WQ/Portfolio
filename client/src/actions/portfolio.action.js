import axios from 'axios'

export const FETCH_PORTFOLIOS_BEGIN = "FETCH_PORTFOLIOS_BEGIN"
export const FETCH_PORTFOLIOS_SUCCESS = "FETCH_PORTFOLIOS_SUCCESS"
export const FETCH_PORTFOLIOS_FAILURE = "FETCH_PORTFOLIOS_FAILURE"

export const SAVE_CURRENT_WORK = "SAVE_CURRENT_WORK"
export const CLEAR_CURRENT_WORK = "CLEAR_CURRENT_WORK"

export const saveCurrentWork = curr => ({
    type: SAVE_CURRENT_WORK,
    payload: { curr }
})

export const clearCurrentWork = () => ({
    type: CLEAR_CURRENT_WORK
})

//for saving user work temporarily on localStorage and in redux state
export async function saveCurrentWorkToLocal(curr) {
    return dispatch => {
        window.localStorage.setItem(process.emv.REACT_APP_AUTOSAVE_LOCALSTORAGE, JSON.stringify(curr))
        dispatch(saveCurrentWork(curr))
        console.log("portfolio work saved temporarily")
    }
}

//removing temporary user work from localStorage and from redux state
export async function clearCurrentWorkFromLocal() {
    return dispatch => {
        window.localStorage.removeItem(process.emv.REACT_APP_AUTOSAVE_LOCALSTORAGE)
        dispatch(clearCurrentWork())
        console.log("portfolio work cleared")
    }
}

export const fetchPortfoliosBegin = () => ({
    type: FETCH_PORTFOLIOS_BEGIN
})

export const fetchPortfoliosSuccess = portfolios => ({
    type: FETCH_PORTFOLIOS_SUCCESS,
    payload: { portfolios }
})

export const fetchPortfoliosFailure = err => ({
    type: FETCH_PORTFOLIOS_FAILURE,
    payload: { err }
})

//Redux thunk allows dispatch actions that return a function. This function must take in user id
export function fetchPortfolios(id) {
    return dispatch => {
        dispatch(fetchPortfoliosBegin());
        return axios({
            method: 'GET',
            url: process.env.REACT_APP_REACT_APP_BACKEND + "/portfolio" + id,
            withCredentials: true
        }).then(res => res.data)
        .then(data => {
            //TODO PROBABLY HAVE TO CONVERT DATA INTO AN ARRAY DEPENDING ON THE RESULT
            dispatch(fetchPortfoliosSuccess(data))
        }).catch(err => dispatch(fetchPortfoliosFailure(err)))
    }
}