import { 
    LOG_IN_USER,
    LOG_OUT_USER
} from '../actions/login.action'

const GUEST = "Guest"

const initialState = {
    loggedIn: false,
    user: GUEST,
    error: null
}

export default function login(state = initialState, action) {
    switch(action.type) {
        case LOG_IN_USER:
            return {
                ...state,
                user: action.payload.user,
                loggedIn: true
            }
        case LOG_OUT_USER:
            return {
                ...state,
                user: GUEST,
                loggedIn: false
            }
        default:
            return state
    }
}