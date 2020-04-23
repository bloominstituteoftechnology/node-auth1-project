const db = require("../database/dbConfig.js");

module.exports = {
  findUsers,
  findById,
  addUser,
  findBy,
};

function findUsers() {
  return db("users").select("id", "username");
}

function findById(id) {
  return db("users").select("id", "username").where({ id }).first();
}

async function addUser(user) {
  const [id] = await db("users").insert(user);

  return findById(id);
}

function findBy(user) {
  return db("users").where(user).first();
}
