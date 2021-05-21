import {
    FETCH_PORTFOLIOS_BEGIN,
    FETCH_PORTFOLIOS_SUCCESS,
    FETCH_PORTFOLIOS_FAILURE,
    SAVE_CURRENT_WORK,
    CLEAR_CURRENT_WORK
} from '../actions/portfolio.action'

const initialState = {
    portfolios: [],
    loading: false,
    error: null,
    currentWork: null
}

export default function portfolioReducer(state = initialState, action) {
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