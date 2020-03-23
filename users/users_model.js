const db = require('../data/dbConfig');

module.exports = {
  find,
  add
};

function find() {
  return db.select('id', 'username').from('users');
}

function add(user) {
  return db('users').insert(user);
}
