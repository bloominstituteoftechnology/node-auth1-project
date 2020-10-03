const db = require("../database/db-config.js");

module.exports = {
  add,
  find,
  findBy,
  findById,
  remove, 
};

function find() {
  // return db("users").select("id", "username").orderBy("id");
  return db("users").orderBy("id");  // --> this returns everything
}

function findBy(filter) {
  return db("users").where(filter).orderBy("id");
}

async function add(user) {
  try {
    const [id] = await db("users").insert(user, "id");

    return findById(id);
  } catch (error) {
    throw error;
  }
}

function findById(id) {
  return db("users").where({ id }).first();
}

function remove(id) {
  return db('user')
  .where({ id })
  .del();
}
