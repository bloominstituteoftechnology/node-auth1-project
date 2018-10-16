import { FETCHING, FETCHED, FETCH_ERROR, LOGGING_IN, LOGGING_OUT, LOGGED_IN, LOGGED_OUT, LOG_IN_ERROR, LOG_OUT_ERROR, ADD_USER, ADDED_USER, ADD_USER_ERROR } from '../actions';

const initialState = {
    users: [],
    fetchingUsers: false,
    addingUser: false,
    loggingIn: false,
    loggingOut: false,
    isLoggedIn: false,
    error: ''
};

export default function (state = initialState, action) {
    switch(action.type) {
        case FETCHING:
            return {...state, fetchingUsers: true};
        case FETCHED:
            return {...state, users: [...action.payload], fetchingUsers: false};
        case ADD_USER:
            return {...state, addingUser: true};
        case ADDED_USER:
            return {...state, addingUser: false};
        case LOGGING_IN:
            return {...state, loggingIn: true};
        case LOGGED_IN:
            return {...state, loggingIn: false, isLoggedIn: true};
        case LOGGING_OUT:
            return {...state, loggingOut: true};
        case LOGGED_OUT:
            return {...state, loggingOut: false, isLoggedIn: false};
        case FETCH_ERROR:
            return {...state, fetchingUsers: false, error: action.payload };
        case ADD_USER_ERROR:
            return {...state, addingUser: false, error: action.payload };
        case LOG_IN_ERROR:
            return {...state, loggingIn: false, error: action.payload };
        case LOG_OUT_ERROR:
            return {...state, loggingOut: false, error: action.payload };
        default:
            return state;
    }
}