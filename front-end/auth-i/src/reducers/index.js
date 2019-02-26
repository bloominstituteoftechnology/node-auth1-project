import {
    ADDING_USER,
    USER_ADDED,
    ADD_USER_FAILURE,
    LOGGING_IN,
    LOGIN_SUCCESSFUL,
    LOGIN_FAILURE,
} from "../actions";

const initialState = {
    users: [],
    user:[],
    addingUser: false,
    loggingIn: false,
}


function reducer(state = initialState, action) {
    switch(action.type) {
        case USER_ADDED:
        return {
            ...state,
            users: action.payload,
            addingUser: false,
        }

        case LOGIN_SUCCESSFUL:
        return {
            ...state,
            user: action.payload,
            loggingIn: false,
        }


        default:
        return state;
    }
}

export default reducer;