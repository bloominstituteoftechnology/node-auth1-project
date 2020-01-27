const db = require('../data/dbConfig.js');

module.exports = {
    findById,
    add,
    find,
    findBy
}

function findById(id){
    return db('users').where({id}).select('id', 'username');
}

function add(user){
    return db('users')
    .insert(user, 'id')
    .then(([id]) => {
        return findById(id);
    })
}

function find(){
    return db('users')
}

function findBy(filter){
    return db('users').where(filter).select('users.id', 'users.username', 'users.password').first()
}