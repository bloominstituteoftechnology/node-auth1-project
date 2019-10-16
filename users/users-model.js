const db = require('../data/db-config.js');

module.exports = {
  add,
  find,
  findBy,
  findById,
};

function find() {
  return db('users').select('id', 'username');
}

function findBy(filter) {
  return db('users').where(filter);
}

function add(userInfo) {
  return db('users')
      .insert(userInfo, 'id')

}


function findById(id) {
  return db('users')
    .where({ id })
    .first();
}
