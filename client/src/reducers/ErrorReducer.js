/**
 * ErrorReducer exports reducers which is a function that determines changes to an application's state.
 * 
 * @module ErrorReducer
 * @author Chen En
 * @category Reducer
 */

import { ADD_ERROR, REMOVE_ERROR } from "../actions/ErrorAction";

const initialState = {
    errors: [],
    requestErrors: []
}

const copyArr = arr => {
    const temp = [];
    for (let item of arr) {
        temp.push(item);
    }
    return temp;
}

export default function error(state = initialState, action) {
    switch(action.type) {
        case ADD_ERROR:
            if (action.payload.status === undefined) {
                const temp = copyArr(state.errors);
                temp.push(action.payload.message);
                return {
                    ...state,
                    errors: temp
                };
            } else {
                const temp = copyArr(state.requestErrors);
                temp.push(`${action.payload.status}${action.payload.message}`);
                return {
                    ...state,
                    requestErrors: temp
                };
            }
        case REMOVE_ERROR:
            if (action.payload.isStatus) {
                const temp = copyArr(state.requestErrors);
                temp.pop();
                return {
                    ...state,
                    requestErrors: temp
                };
            } else {
                const temp = copyArr(state.errors);
                temp.pop();
                return {
                    ...state,
                    errors: temp
                };
            }
        default:
            return state
    }
}
