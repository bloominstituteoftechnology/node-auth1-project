const db = require('../data/db-config');

module.exports = {
    add,
    find,
    findBy,
    findById
}

function find() {
    return db('users')
        .select('id', 'username', 'password');
}

function findBy(username) {
    return db('users')
        .select('id', 'username', 'password')
        .where(username)
        .first();
}

function add(user) {
    return db('users')
        .insert(user, 'id')
        .then(ids => {
            const [id] = ids;
            return db('users')
                .select('id', 'username', 'password')
                .where({ id })
                .first();
        })
}

function findById(id) {
   return db('users')
       .select('id', 'username')
       .where({ id })
       .first();
}