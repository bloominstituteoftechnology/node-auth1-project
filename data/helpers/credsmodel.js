const db = require('../dbconfig');

// find() -> [{id: int, username: 'string'}, ..., {id: int, username: 'string'}]
// find(userId) -> {id: int, username: 'string'}
const find = (id) => {
    if(id) {
        return db('users')
            .select('id', 'username')
            .where({id})
            .first();
    } else {
        return db('users')
            .select('id', 'username');
    }
};

// addNewUser({username: 'string', password: 'hashed string'}) -> [id: int]
const addNewUser = (userObj) => {
    return db('users')
        .insert(userObj)
        .into('users');
};

// authUser({username: 'string'}) -> {id: int, username: 'string', password: 'hashed string'}
const authUser = (userObj) => {
    return db('users')
		.where({username: userObj.username})
		.first();
};

module.exports = {
    find, 
    addNewUser,
    authUser
};
