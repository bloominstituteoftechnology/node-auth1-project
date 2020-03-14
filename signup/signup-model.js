const db = require('../database/dbConfig')
const bcrypt = require("bcryptjs")

module.exports = {
    get,
    signup
}

function get() {
    return db("users")
}

async function signup(creds) {
    const hashPassword = bcrypt.hashSync(creds.password, 14)
    creds.password = hashPassword

    const user = await db("users").insert(creds)
    return user
} 