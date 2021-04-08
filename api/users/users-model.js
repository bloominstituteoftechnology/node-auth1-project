const db = require('../../data/db-config');
/**
  // * resolves to an ARRAY with all users, each user having { user_id, username }
 */
async function find() {
	return await db('users').select('user_id', 'username').orderBy('user_id');
}

/**
  // * resolves to an ARRAY with all users that match the filter condition
 */
function findBy(filter) {
	return db('users').where(filter).orderBy('user_id');
}

/**
  // * resolves to the user { user_id, username } with the given user_id
 */
function findById(user_id) {
	return db('users').where({ user_id }).first();
}

/**
  // * resolves to the newly inserted user { user_id, username }
 */
async function add(user) {
	const [user_id] = await db('users').insert(user, 'user_id');
	return findById(user_id).select('user_id', 'username');
}

// !! Don't forget to add these to the `exports` object so they can be required in other modules

module.exports = { find, findBy, findById, add };
