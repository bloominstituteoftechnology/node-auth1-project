const db = require('../data/db-config')

module.exports = {
    find,
    findBy,
    findById,
    add,

}

function find(){
    return db('users')
    .select('id', 'username')
}

function findBy(filter){
    console.log(filter)
    return db('users')
        .where(filter)
        
}

function findById(id){
    return db('users')
        .where({id})
        .select('id', 'username')
        .first()
}

function add(user){
    console.log(user)
    return db('users')
        .insert(user)
        .then(id => findById(id[0]))
}