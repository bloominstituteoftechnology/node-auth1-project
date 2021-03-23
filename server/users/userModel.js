const db = require('../../database/db-config');


const get = () => {
    return db('users')
    .select('id', 'username', 'password')
    .orderBy('id')
}
module.exports = {
get,

}