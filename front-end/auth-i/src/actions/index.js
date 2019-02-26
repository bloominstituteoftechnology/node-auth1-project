import axios from 'axios';

export const ADDING_USER = 'ADDING_USER';
export const USER_ADDED = 'USER_ADDED';
export const ADD_USER_FAILURE = 'ADD_USER_FAILURE';

export const LOGGING_IN = 'LOGGING_IN';
export const LOGIN_SUCCESSFUL = 'LOGIN_SUCCESSFUL';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';


export const addUser = () => dispatch => {
    dispatch({type: ADDING_USER});
    axios.post('http://localhost:4000/api/register', user)
    .then(res => {
        dispatch({type: USER_ADDED, payload: res.data});
    })
    .catch(err => dispatch({type: ADD_USER_FAILURE, payload: err}));
};

export const userLogin = () => dispatch => {
    dispatch({type: LOGGING_IN});
    axios.post('http://localhost:4000/api/login', username, password)
    .then(res => {
        dispatch({type: LOGIN_SUCCESSFUL, payload: res.data});
    })
    .catch(err => dispatch({type: LOGIN_FAILURE, payload: err}));
};