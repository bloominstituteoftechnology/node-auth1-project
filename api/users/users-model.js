const db = require('../../data/db-config')
/**
  resolves to an ARRAY with all users, each user having { user_id, username }
 */
async function find() {
  const users = await db('users')
    .select('user_id', 'username')
  return users

}

/**
  resolves to an ARRAY with all users that match the filter condition
 */
async function findBy(filter) {
  const [users] = await db('users')
    // .select('user_id', 'username')
    .where('user_id', filter).orWhere('username', filter).orWhere('password',filter)
  return users
}

/**
  resolves to the user { user_id, username } with the given user_id
 */
async function findById(user_id) {
  const users = await db('users')
    .select('user_id', 'username')
    .where('user_id', user_id)
  return users
}

/**
  resolves to the newly inserted user { user_id, username }
 */
async function add(user) {
  const newID = await db('users')
    .insert(user)
  const newUser = await db('users')
    .select('user_id', 'username')
    .where('user_id', newID)
    .first()
  return(newUser)

}

// Don't forget to add these to the `exports` object so they can be required in other modules
module.exports = {
  find,
  findBy,
  findById,
  add,
}