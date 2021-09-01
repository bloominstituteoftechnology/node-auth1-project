module.exports = {
  find,
  findBy,
  findById,
  add
}


/**
  resolves to an ARRAY with all users, each user having { user_id, username }
 */
function find() {
  return db('users').select('user_id', 'username')

}

/**
  resolves to an ARRAY with all users that match the filter condition
 */
function findBy(filter) {
  return db('users').where(filter)

}

/**
  resolves to the user { user_id, username } with the given user_id
 */
function findById(user_id) {
  return db('users').where({user_id}).first().then(data => {
    return data
  })
  .catch(err => {
    console.log(err)
  })
}

/**
  resolves to the newly inserted user { user_id, username }
 */
function add(user) {
  // why make it an array?
  const [id] = await db('users').insert(user, 'user_id')
  return findById(id)

}