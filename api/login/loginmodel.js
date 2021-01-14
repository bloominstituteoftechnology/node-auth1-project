const db = require("../../data/dbConfig")

function findBy(filter) {
	return db("users")
		.select("id", "user_name", "password")
		.where(filter)
}

module.exports={
    findBy
}