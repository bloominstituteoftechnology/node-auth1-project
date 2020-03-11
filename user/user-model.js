const db = require('../data/config');
const bcrypt = require('bcryptjs');

async function add(user) {
    //hash the password with a time complexity of 14 
    user.password = await bcrypt.hash(user.password, 14)
    const [id] = await db("users").insert(user)
    return findById(id)
}

function find() {
    return db("users").select("id", "username")
}

function findBy(filter) {
    return db("users")
            .select("id", "username", "password")
            .where(filter);
}

function findById(id) {
    return db("users")
        .select("id", "username")
        .where({ id })
        .first()
}

module.exports = {
    add,
    find,
    findBy,
    findById
}