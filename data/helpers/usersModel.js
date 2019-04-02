const db = require('./data/dbConfig.js');

module.exports = {
  add,
  find,
  findById
};

async function add(user) {
  const [id] = await db('users').insert(user);

  return findById(id);
};

function find() {
  return db('users').select('id', 'username', 'password');
};

function findById(id) {
  return db('users')
    .where({ id })
    .first();
}