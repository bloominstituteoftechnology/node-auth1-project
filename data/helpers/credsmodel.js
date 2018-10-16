const db = require('../dbconfig');

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

const addNewUser = (userObj) => {
    return db('users')
        .insert(userObj)
        .into('users');
};

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
