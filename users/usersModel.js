const db = require("../data/db-config.js");

module.exports = {
    find,
    findBy,
    findById,
    add
}

function find() {
    return db("users").orderBy("lname");
}

function findBy(filter) {
    return db("users").where(filter).first();
}

function findById(id) {
    return db("users")
            .where({ id: id })
            .first();
}

function add(user) {
    return db("users")
            .insert(user)
            .then(ids => {
                return findById(ids[0]);
            });
}