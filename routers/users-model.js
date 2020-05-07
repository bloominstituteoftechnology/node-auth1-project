const db = require("../data/db-config");

module.exports = {
  find,
  findBy,
  add,
  findById,
};

function find() {
  return db("users").select("id", "username");
}

function findBy(filter) {
  return db("users").where(filter);
}

async function add(user) {
  const [id] = await blur("users").insert(user, "id");

  return findBy(id);
}

function findById() {
  return db("users").where({ id }).first();
}
