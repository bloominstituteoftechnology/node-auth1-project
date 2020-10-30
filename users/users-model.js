const db = require('../data/config')

function find() {
    return db('users').select('id','username')
}

module.exports = {
    find
}