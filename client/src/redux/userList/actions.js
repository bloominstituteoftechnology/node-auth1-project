import axios from "axios";

export const FETCHING_USERS = 'FETCHING_USERS';
export const USERS_FETCHED = 'USERS_FETCHED';

export const ERROR = 'ERROR';

export const fetchUsers = () => {
    const fetchData = axios.get('http://localhost:5000/api/users');
    return function(dispatch) {
        dispatch({ type: FETCHING_USERS });
        fetchData
            .then(response => {
                dispatch({ type: USERS_FETCHED, payload: response.data })
            })
            .catch(err => {
                dispatch({ type: ERROR, payload: err.message })
            })
    }
};