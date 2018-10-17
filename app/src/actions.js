import axios from 'axios';

export const LOGGINGIN = 'LOGGINGIN';
export const LOGGEDIN = 'LOGGEDIN';
export const ERROR = 'ERROR';
export const LOGGINGOUT = 'LOGGINGOUT';
export const LOGGEDOUT = 'LOGGEDOUT';

export const logIn = user =>{
    return dispatch =>{
        dispatch({type:LOGGINGIN})
            axios
                .post('http://localhost:8000/login', user)
                .then(response=>{
                    dispatch({type:LOGGEDIN, payload: response.data.welcome})
                })
                .catch(err => {dispatch({type:ERROR, payload:err.message});});
    }
};

export const logOut = () =>{
    return dispatch =>{
        dispatch({type:LOGGINGOUT})
            axios
                .get('http://localhost:8000/logout')
                .then(response=>{
                    dispatch({type:LOGGEDOUT})
                })
                .catch(err => dispatch({type:ERROR, payload:err.message}));
    }
};