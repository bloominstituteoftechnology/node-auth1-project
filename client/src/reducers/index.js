import { LOGIN_USER, LOGIN_USER_SUCCESS } from '../actions';

const initialState = {
  loggingIn: false,
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
    default:
      return state;
  }
};
