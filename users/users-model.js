const db = require('../data/config')

function find() {
    return db('users').select('id','username')
}

function findBy(filter) {
	return db("users")
		.select("id", "username", "password")
		.where(filter)
}

async function add(user) {
	const [id] = await db("users").insert(user)
	return findById(id)
}


module.exports = {
    find,
    findBy,
    add
}