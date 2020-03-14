const db = require("../database/dbConfig")

module.exports = {
    getUser
}

async function getUser(filter) {
    return db("users").where(filter).select("id", "username", "password").first()
} 