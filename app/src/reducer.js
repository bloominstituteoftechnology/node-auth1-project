import {ERROR, LOGGINGIN, LOGGEDIN, LOGGINGOUT, LOGGEDOUT} from './actions';

const initialState = {
    loggingIn: false,
    loggedIn: false,
    username: '',
    error: null
};

const reducer = (state=initialState, action) => {
    switch(action.type){
        case LOGGINGIN:
            return{
                loggingIn: true
            }
        case LOGGEDIN:
            return{
                loggingIn: false,
                loggedIn: true,
                username: action.payload
            }
        case LOGGINGOUT:
            return{
                loggingIn: true,
            }
        case LOGGEDOUT:
            return{
                loggedIn: false,
                username: ''
            }
        case ERROR:
            console.error(action.payload);
            return{
                error: action.payload
            }
        default:
            return state;
    }
};

export default reducer;