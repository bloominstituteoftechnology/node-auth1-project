const db = require('../data/dbConfig');

module.exports = {
    add,
    findByUser,
    find
};

function add(user) {
    return db('users')
        .insert(user)
}

function findByUser(username) {
    return db('users').where({ username });
}

function find() {
    return db('users').select();
}
  