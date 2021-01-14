const db = require("../database/config")

module.exports = {
    findUser,
    findUserId,
    addUser
}

function findUser() {
    return db('users').select('id','username')
}

function findUserId(id) {
    return db('users')
        .select('id', 'username')
        .where({id})
        .first()
}

async function addUser(user) {
    const [id] = await db('users').insert(user)
    return findUserId(id)
}