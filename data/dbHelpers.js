const db = require('../data/dbConfig')

module.exports = {find, findBy, addUser, findById}

function find() {
    return db('users')
}


function findBy(condition) {
    return db('users').where(condition)
}

async function addUser(user) {
    const [id] = await db('users').insert(user)
    return await findById(id)
}

function findById(id) {
    return db('users')
        .where({id:id})
        .first()
}

