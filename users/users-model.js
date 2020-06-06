const db = require('../data/dbConfig');

function findUsers() {
    return db('users')
}

function addUser() {
    return db('users').insert(users);
}



module.exports = {
    findUsers,
    addUser
};