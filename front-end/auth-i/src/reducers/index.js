import {
    ADDING_USER,
    USER_ADDED,
    ADD_USER_FAILURE
} from "../actions";

const initialStat = {
    users: [],
    addingUser: false,
}


function reducer(state = initialState, action) {
    switch(action.type) {
        case USER_ADDED:
        return {
            ...state,
            smurfs: action.payload,
            addingUser: false,
        }


        default:
        return state;
    }
}

export default reducer;