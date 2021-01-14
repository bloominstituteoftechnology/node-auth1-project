const db= require("../../data/dbConfig")

function find() {
	return db("users").select("id", "user_name")
}


module.exports={
    find
}