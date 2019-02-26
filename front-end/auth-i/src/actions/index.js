import axios from 'axios';

export const ADDING_USER = 'ADDING_USER';
export const USER_ADDED = 'USER_ADDED';
export const ADD_USER_FAILURE = 'ADD_USER_FAILURE';


export const addUser = () => dispatch => {
    dispatch({type: ADDING_USER});
    axios.post('http://localhost:4000/api/register', user)
    .then(res => {
        dispatch({type: USER_ADDED, payload: res.data});
    })
    .catch(err => dispatch({type: ADD_USER_FAILURE, payload: err}));
};