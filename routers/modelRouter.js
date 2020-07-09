const db = require("../data/dbconfig")

async function getUser() {
    return db('users')

}

async function addUser(user) {
	const [id] = await db("users").insert(user)
	return findUserById(id)
}

function findUserBy(filter) {
	return db("users")
		.select("id", "username", "password")
		.where(filter)
}

function findUser() {
	return db("users").select("id", "username")
}

function findUserById(id) {
	return db("users")
		.select("id", "username")
		.where({ id })
		.first()
}

module.exports = {
    getUser,
    addUser,
    findUserBy,
    findUser,
    findUserById
}