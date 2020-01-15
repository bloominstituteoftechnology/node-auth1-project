const db = require('../data/db-config')
const bcrypt = require("bcryptjs")

module.exports = {
    get,
    signup
}

function get() {
    return db("users")
}

async function signup(creds) {
    const hashPassword = bcrypt.hashSync(creds.password, 13)
    creds.password = hashPassword

    const user = await db("users").insert(creds)
    return user
}