const knex = require('knex');
const knexConfig = require('../../knexfile');
const db = knex(knexConfig.development);

module.exports = {
  find
};

function find(id) {
  const query = db('users');
  if (id) {
    return query
      .where({ id })
      .select('id', 'username', 'password')
      .first()
  } else return query;
};
