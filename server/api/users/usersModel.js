const db = require('../../data/dbConfig.js');

module.exports = {
    find,
    findBy,
    add
}

function find() {
    return db('users');
}

function findById(id){
    return db('users')
        .where({ id })
        .first();
}

function findBy(filter) {
    return db('users')
        .select('id', 'username', 'password')
        .where(filter)
        .first()
}

function add(newUser) {
    return db('users')
        .insert(newUser)
            .then(id => {
                return findById(id[0]);
            })
}