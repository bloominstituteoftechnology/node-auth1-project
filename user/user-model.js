
const db = require('../data/dbConfig.js')


module.exports = {
    addUser,
    findBy,
    find

}

function addUser(user) {
    return db("user").insert(user);
}

function findBy(any) {
    return db('user').where(any).orderBy('id')
}

function find() {
    return db("user")

}