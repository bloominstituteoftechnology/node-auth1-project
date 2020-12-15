const db = require("../data/connection");

module.exports = {
  find,
  add,
  findBy,
  findById,
};

function find() {
  return db("users").select("users.username", "users.id");
}

function findBy(filter) {
  return db("users").where(filter);
}
function findById(id) {
  return db("users").where({ id });
}
function add(newUser) {
  return db("users")
    .insert(newUser)
    .then((ids) => {
      const id = ids[0];
      return findById(id);
    });
}