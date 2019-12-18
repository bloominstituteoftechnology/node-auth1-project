import axios from "axios";
export const LOGIN_LOADING = "LOGIN_LOADING";
export const LOGIN_FETCH = "LOGIN_FETCH";
export const LOGIN_FAILED = "LOGIN_FAILED";

export const loginReq = values => dispatch => {
  axios.get("https://nodewithsession.herokuapp.com/api/login").then(res => {
    console.log(res);
  });
};
