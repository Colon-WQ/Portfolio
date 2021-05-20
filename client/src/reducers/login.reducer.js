import { 
    LOG_IN_USER,
    LOG_OUT_USER,
    REPOPULATE_STATE
} from '../actions/login.action';

const GUEST = "Guest"

const initialState = {
    loggedIn: false,
    name: GUEST,
    id: '',
    avatar_url: '',
    gravatar_id: '',
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