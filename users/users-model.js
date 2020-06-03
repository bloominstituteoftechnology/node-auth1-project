const db = require('../data/dbconfig')

module.exports = {
    add,
    findBy,
    get
}

function add(user) {
    return db('users').insert(user)
}

function findBy(username) {
    return db('users').where({username})
}

function get() {
    return db('users').select('username')
}