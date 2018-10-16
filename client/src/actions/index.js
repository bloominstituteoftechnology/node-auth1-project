import axios from 'axios';

export const FETCHING = 'FETCHING';
export const FETCHED = 'FETCHED';
export const FETCH_ERROR = 'FETCH_ERROR';
export const LOGGING_IN = 'LOGGING_IN';
export const LOGGED_IN = 'LOGGED_IN';
export const LOG_IN_ERROR = 'LOG_IN_ERROR';
export const LOGGING_OUT = 'LOGGING_OUT';
export const LOGGED_OUT = 'LOGGED_OUT';
export const LOG_OUT_ERROR = 'LOG_OUT_ERROR';
export const ADD_USER = 'ADD_USER';
export const ADDED_USER = 'ADDED_USER';
export const ADD_USER_ERROR = 'ADD_USER_ERROR';


export const fetchUsers = () => {
    return dispatch => {
        dispatch({ type: FETCHING });
        
        axios.get('http://localhost:8888/api/restricted/users')
        .then(response => {
            dispatch({
                type: FETCHED,
                payload: response.data
            });
        })
        .catch(err => {
            console.log(err);
            dispatch({ type: FETCH_ERROR, payload: err })
        });
    }
}

export const logIn = (creds) => {
    return dispatch => {
        dispatch({ type: LOGGING_IN });
        axios
        .post('http://localhost:8888/api/login', creds)
        .then(response => {
            dispatch({
                type: LOGGED_IN,
                payload: response.data
            });
        })
        .catch(err => {
            dispatch({ type: LOG_IN_ERROR, payload: err });
        });
    }
}

export const logOut = () => {
    return dispatch => {
        dispatch({ type: LOGGING_OUT });
        axios.get('http://localhost:8888/api/logout')
        .then(response => {
            dispatch({
                type: LOGGED_IN,
                payload: response.data
            });
        })
        .catch(err => {
            dispatch({ type: LOG_OUT_ERROR, payload: err })
        });
    }
}

export const addNewUser = (user) => {
    return dispatch => {
        dispatch({ type: ADD_USER });
        axios
        .post('http://localhost:8888/api/register', user)
        .then(response => {
            dispatch({
                type: ADDED_USER,
                payload: response.data
            });
        })
        .catch(err => {
            dispatch({ type: ADD_USER_ERROR, payload: err })
        });
    }
}