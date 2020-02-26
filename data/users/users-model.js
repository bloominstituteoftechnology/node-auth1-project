const knex = require('knex');
const knexConfig = require('../../knexfile');
const db = knex(knexConfig.development);

module.exports = {
  find,
  findBy,
  findById,
  insert,
  update,
  remove,
};

function find() {
  return db('users');
}

function findById(id) {
  return db('users')
    .where({ id: Number(id) })
    .first();
}

function findBy(filter) {
  return db('users').where(filter);
}


function insert(user) {
  return db('users')
    .insert(user)
    // .then(ids => ({ id: ids[0] }));
    .then(ids => ({ ids }));
}

function update(id, user) {
  return db('users')
    .where('id', Number(id))
    .update(user);
}


function remove(id) {
  return db('users')
    .where('id', Number(id))
    .del();
}
