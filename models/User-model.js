const db = require('../database/db-config');

module.exports = {
  createUser
};

function createUser(user) {
  console.log(user);
  return db('users').insert(user);
}
