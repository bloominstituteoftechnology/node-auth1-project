const knex = require('knex');
const dbconfig = require('./knexfile');
const db = knex(dbconfig.development);

registerUser = (newUser) => {
    return db('users')
        .insert(newUser).
        then(ids => ({ id: ids[0] }))
};

findByUser = (username) => {
    return db('users')
        .where('username', username)
};


module.exports = {
    findByUser,
    registerUser
}