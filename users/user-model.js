const db = require("../data/config")

function findUser(un) {
    return db("users")
    .where("username", un)
    .select("id","username","password")
}

function findById(id) {
	return db("users")
		.select("id", "username")
		.where({ id })
		.first()
}

async function addUser(user){
    const [id] = await db("users").insert(user)
    return findById(id)
}

function findAllUsers() {
    return db("users").select("id","username")

}

module.exports = {
    findUser, addUser, findAllUsers
}