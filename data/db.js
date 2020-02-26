const knex = require('knex');
const config = require('../knexfile.js');
const db = knex(config.development);

module.exports = {
  getUsers,
  getUserById,
  getUserByName,
  addUser,
};

function getUsers() {
    return db('users');
}

function getUserById(ID) {

    return db('users')
      .where({ id: Number(ID) })
      .first();

}

function getUserByName(username) {
  return db('users')
  .where({ username: username })
  .first();
}

function addUser(username, password) {
    console.log('Storing ' + username + ' (Hashed password: ' + password +')');
    return db('users')
      .insert({username: username, password: password})
      .then(ids => ({ id: ids[0] }));
}