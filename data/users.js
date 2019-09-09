const db = require('./dbConfig.js');

module.exports = {
  add,
  find,
  findBy,
  findById,
};

function find() {
  return db('authentication').select('id', 'username');
}

function findBy(filter) {
  return db('authentication').where(filter);
}

function add(user) {
  return db('authentication')
    .insert(user, 'id')
    .then(ids => {
      const [id] = ids;
      return findById(id);
    });
}

function findById(id) {
  return db('authentication')
    .where({ id })
    .first();
}
