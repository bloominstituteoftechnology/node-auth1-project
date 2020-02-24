const db = require("../data/dbConfig");

module.exports = {
  find,
  findBy,
  addUser,
  findById
};

function findById(id) {
  return db("users")
    .where({ id })
    .first();
}

function find() {
  return db("users").select("id", "username", "password");
}

function findBy(filter) {
  return db("users")
    .select("id", "username", "password")
    .where(filter);
}

function addUser(newUser) {
  return db("users")
    .insert(newUser)
    .then(ids => {
      const [id] = ids;
      return findById(id);
    });
}
