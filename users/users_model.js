const db = require('../data/dbConfig');

module.exports = {
  find,
  add,
  findBy
};

function find() {
  return db.select('id', 'username').from('users');
}

function add(user) {
  return db('users').insert(user);
}

function findBy(filter) {
  return db
    .select('*')
    .from('users')
    .where(filter);
}

function findById(id) {
  return db
    .select('id', 'username')
    .from('users')
    .where({id})
    .first();
}
