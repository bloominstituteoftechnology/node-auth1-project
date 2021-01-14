const db= require("../../data/dbConfig")


function findById(id) {
	return db("users")
		.select("id", "user_name")
		.where({ id })
		.first()
}

function findBy(filter) {
	return db("users")
		.select("id", "user_name", "password")
		.where(filter)
}

async function add(user) {
	const [id] = await db("users").insert(user)
	return findById(id)
}

module.exports={
    findBy,
    add,
    
}