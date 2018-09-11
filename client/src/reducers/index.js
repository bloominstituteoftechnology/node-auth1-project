import {
  LOGIN_USER,
  LOGIN_USER_SUCCESS,
  GET_USERS,
  GET_USERS_SUCCESS,
  LOGOUT_USER,
  LOGOUT_USER_SUCCESS,
  SIGNUP_USER,
  SIGNUP_USER_SUCCESS,
} from '../actions';

const initialState = {
  loggingIn: false,
  loggingOut: false,
  getUsers: false,
  signingUp: false,
  loggedInUser: '',
  users: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_USER:
      return {
        ...state,
        loggingIn: true,
      };
    case LOGIN_USER_SUCCESS:
      return {
        ...state,
        loggingIn: false,
        loggedInUser: action.payload,
      };
    case GET_USERS:
      return {
        ...state,
        getUsers: true,
      };
    case GET_USERS_SUCCESS:
      return {
        ...state,
        getUsers: false,
        users: action.payload,
      };
    case LOGOUT_USER:
      return {
        ...state,
        loggingOut: true,
      };
    case LOGOUT_USER_SUCCESS:
      return {
        ...state,
        loggingOut: false,
        loggedInUser: '',
        users: [],
      };
    case SIGNUP_USER:
      return {
        ...state,
        signingUp: true,
      };
    case SIGNUP_USER_SUCCESS:
      return {
        ...state,
        signingUp: false,
      };
    default:
      return state;
  }
};
