export const LOGGED_OUT = 'LOGGED_OUT';
export const LOGIN_ACTION = 'LOGIN_ACTION';

let users = [];

export const LogInAction = (userObject) => {
    return {
        type: LOGIN_ACTION,
        payload: userObject
        // isLogin: bool
    }
}