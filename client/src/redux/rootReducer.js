import { FETCHING_USERS, USERS_FETCHED, ERROR } from "./userList/actions.js";

const initialState = {
    users: [],
    fetchingUsers: false,
    usersFetched: false
}

export const rootReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCHING_USERS:
            return {...state, fetchingUsers: true };
        case USERS_FETCHED:
            return {...state, fetchingUsers: false, usersFetched: true, users: state.users.concat(action.payload)}

        case ERROR: 
            return {...state, error: action.payload}
        default:
            return state;
    }
}

export default rootReducer;