const db = require('../data/db-config'); 

module.exports = {
    find, 
    findById, 
    add, 
    findBy
}

function find() {
    return db('users'); 
}

function findById(id){
    return db('users')
        .where({ id })
        .first(); 
}

function add(user){
    return db('users')
        .insert(user, 'id')
            .then(([id]) => {
                return findById(id);
            });
}

function findBy(username){
    return db('users')
        .where({ username })
        .first(); 
}