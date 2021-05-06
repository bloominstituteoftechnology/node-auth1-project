const db = require("../../data/db-config")

function find() {
  return db("users")
    .select("user_id", "username")
}

function findBy(filter) {
  return db("users")
    .select("user_id", "username", "password" )
    .where(filter)
}

/**
  resolves to the user { user_id, username } with the given user_id
 */
function findById(user_id) {
  return db("users")
    .select("user_id", "username")
    .where({ user_id })
    .first()
}

/**
  resolves to the newly inserted user { user_id, username }
 */
async function add(user) {
  const [id] = await db("users")
    .insert(user)

  return findById(id)
}

// Don't forget to add these to the `exports` object so they can be required in other modules
module.exports = {
  find,
  findBy,
  findById,
  add
}