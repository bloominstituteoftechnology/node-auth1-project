const db = require('../../data/db-config')

/**
  resolves to an ARRAY with all users, each user having { user_id, username }
 */
function find() {
  return db('users')
  .select('user_id', 'username')
}

/**
  resolves to an ARRAY with all users that match the filter condition
 */
function findBy(filter) {
  return db('users')
  .where(filter)
  // .orderBy('user_id')
  // .first()
}

/**
  resolves to the user { user_id, username } with the given user_id
 */
async function findById(user_id) {
  return db('users')
    .where({ user_id })
    .first()
}

/**
  resolves to the newly inserted user { user_id, username }
 */
function add(user) {
  const [id] = db('users').insert(user)
  return findById(id)
}

// Don't forget to add these to the `exports` object so they can be required in other modules
module.exports = {
  find,
  findBy,
  findById,
  add,
}