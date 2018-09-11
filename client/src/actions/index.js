import axios from 'axios';

export const LOGIN_USER = 'LOGIN_USER';
export const LOGIN_USER_SUCCESS = 'LOGIN_USER_SUCCESS';
export const SIGNUP_USER = 'SIGNUP_USER';
export const SIGNUP_USER_SUCCESS = 'SIGNUP_USER_SUCCESS';
export const GET_USERS = 'GET_USERS';
export const GET_USERS_SUCCESS = 'GET_USERS_SUCCESS';
export const LOGOUT_USER = 'LOGOUT_USER';
export const LOGOUT_USER_SUCCESS = 'LOGOUT_USER_SUCCESS';

const URL = 'http://localhost:7000/api';

export const LogInUser = user => dispatch => {
  dispatch({ type: LOGIN_USER });
  axios
    .post(`${URL}/login`, user)
    .then(response => {
      dispatch({
        type: LOGIN_USER_SUCCESS,
        payload: response.data,
      });
    })
    .catch(err => console.log(err));
};

export const LogOutUser = () => dispatch => {
  dispatch({ type: LOGOUT_USER });
  axios.get(`${URL}/logout`).then(response => {
    dispatch({ type: LOGOUT_USER_SUCCESS });
  });
};
export const SignUpUser = user => dispatch => {
  dispatch({ type: SIGNUP_USER });
  axios.post(`${URL}/register`, user).then(response => {
    dispatch({
      type: SIGNUP_USER_SUCCESS,
      payload: response.data,
    });
  });
};

export const getUsers = () => dispatch => {
  dispatch({ type: GET_USERS });
  axios.get(`${URL}/restricted/users`).then(response => {
    dispatch({ type: GET_USERS_SUCCESS, payload: response.data });
  });
};
