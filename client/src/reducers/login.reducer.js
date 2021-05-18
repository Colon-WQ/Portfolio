import { 
    LOG_IN_USER,
    LOG_OUT_USER
} from '../actions/login.action'

const GUEST = "Guest"

const initialState = {
    loggedIn: false,
    name: GUEST,
    id: '',
    avatar_url: '',
    gravatar_url: '',
    error: null
}

//May need in other components
export const MISSING = ''

//TODO handle actions for GUEST

export default function login(state = initialState, action) {
    switch(action.type) {
        case LOG_IN_USER:
            return {
                ...state,
                loggedIn: true,
                name: action.payload.name,
                id: action.payload.id,
                avatar_url: action.payload.avatar_url,
                gravatar_url: action.payload.gravatar_url,
            }
        case LOG_OUT_USER:
            return {
                ...state,
                loggedIn: false,
                name: GUEST,
                id: MISSING,
                avatar_url: MISSING,
                gravatar_url: MISSING,
            }
        default:
            return state
    }
}