const db = require('../data/dbConfig')

// GET all users
function findAll() {
	return db("users").select("id", "username")
}

module.exports = {
    findAll
}