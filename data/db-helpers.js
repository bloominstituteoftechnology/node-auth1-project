const db = require("./db-config");

function find() {
  return db("users")
    .select("id", "username")
    .orderBy("id");
}
function findByUser(username) {
  return db("users")
    .where({ username })
    .first();
}
function insert(user) {
  return db("users").insert(user);
}

module.exports = { find, findByUser, insert };
