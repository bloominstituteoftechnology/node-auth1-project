const db = require('../data/db-config')

module.exports = {
    find,

}
// jkjh

function find() {
    return db('users')
    .select(
        'id',
        'username',
        'password'
    )
};