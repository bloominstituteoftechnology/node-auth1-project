const db = require("../data/dbconfig.js");

module.exports = {
  find,
  add,
  findBy,
  findById
};

function find() {
  return db("users").select("id", "username");
}
function findBy(filter) {
  return db("users").where(filter);
}
function add(task) {
  return db("users")
    .insert(task, "id")
    .then(ids => {
      const [id] = ids;
      return findById(id);
    });
}
function findById(id) {
  return db("users")
    .select("id", "username")
    .where({ id })
    .first();
}
