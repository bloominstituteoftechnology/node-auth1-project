const db = require('../../data/db-config');
/**
  resolves to an ARRAY with all users, each user having { user_id, username }
 */
function find() {
  return db('users') // table
    .select('user_id', 'username') //select user_id, username
    .orderBy('user_id'); //from users
}

/**
  resolves to an ARRAY with all users that match the filter condition
 */
function findBy(filter) {
  return db('users') //table //select *   
    .where(filter) //where user_id=filter inputted
    .orderBy('user_id'); //order by user_id
}

/**
  resolves to the user { user_id, username } with the given user_id
 */
function findById(user_id) {
  return db('users') //table //select * 
    .where('user_id', user_id) //where user_id=user_id inputted
    .first(); //the first one
}

/**
  resolves to the newly inserted user { user_id, username }
 */
async function add(user) {
  const [user_id] = await db('users').insert('user_id', user);
  return findById(user_id);
}

module.exports = {
  find,
  findBy,
  findById,
  add
};
