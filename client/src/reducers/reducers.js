import {LOGIN_ACTION, LOGGED_OUT} from '../actions/actions';
const initialState = {
    users: [
        // {
        //     username: '',
        //     boolean:''
        // }
    ]
}
export const usersReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOGIN_ACTION:
        console.log("You are logged in for the state");
        
        return (
            Object.assign({}, state, {
                users: [...state.users.concat(action.payload)]
            })
        )
        // return Object.assign({}, state, [{users: ...state.users, action.payload}])
        case LOGGED_OUT:
        // Object.assign({}, )
        console.log("you are logged out in the state")
        default:
        return state;
    }
}