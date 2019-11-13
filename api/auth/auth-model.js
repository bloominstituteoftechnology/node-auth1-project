const db = require('../../database/dbConfig')

module.exports = {add, find}

function add(item) {
    return db('users').insert(item, '*')
}

function find(item) {
    if (item) {
        return db('users').where(item).first()
    }
    else return db('users')
}