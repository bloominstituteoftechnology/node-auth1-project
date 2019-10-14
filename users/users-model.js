const db = require('../data/db-config');

module.exports = {
    find,
    findById,
    add
}

function find() {
    return db('users').select('id', 'username', 'password');
}

function findById(id) {
    return db('users').where({ id }).first();
}

function add(user) {
    return db('users').insert(user, 'id') 
    .then(user => {
        const [id] = user;
        return findById(id);
    })
}