const db = require('../database/db-config');

module.exports = {
  createUser,
  findById
};

async function createUser(user) {
  // returns id in array
  const userID = await db('users').insert(user);
  // calls findById to return user obj
  return await findById(userID[0]);
}

function findById(id) {
  return db('users')
    .select('id', 'username')
    .where({ id });
}
