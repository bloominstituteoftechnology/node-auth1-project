const db = require('../data/dbConfig')

module.exports = {
    add, 
    find, 
    FindBy, 
    FindById
}

function find() {
    return db('users').select('id', 'username', 'password' )
}

function FindBy(filter) {
    return db('users').where(filter)
}

function add(user) {
    return db('users')
    .insert(user, 'id')
    .then(ids => {
        const [id] = ids
        return FindById
    })
}

function FindById(id) {
    return db('users')
    .where({id})
    .first()
}