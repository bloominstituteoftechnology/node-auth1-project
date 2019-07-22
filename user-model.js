const knex = require("knex");

const db = knex(require("./knexfile").development);

module.exports = {
    getUsers,
    findUserByName,
    registerUser
}

function getUsers(){
    return db("users").select("id", "username", "password");
}

function findUserByName(name){
    return db("users").where({username: name}).select("id", "username", "password").first();
}

function findUserById(id){
    return db("users").where({id}).select("id", "username", "password").first();
}

function registerUser(newUser){
    return db("users").insert(newUser).then(ids=> {
        return findUserById(ids[0]);
    });
}