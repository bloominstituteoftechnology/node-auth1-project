const db = require('../data/db-config');

const getUsers = () => {
  return db('user');
}

const getUser = (dataObj) => {
  return db('user').where({ dataObj }).first();
}

const add = (user) => {
  return db('user').insert(user).then((ids) => getUser({ids: ids[0] }));
}

const update = (changes, id) => {
  return db('user').where({ id }).update(changes).then(() => getUser(id));
}

const remove = (id) => {
  return db('user').where({ id }).del();
}

module.exports = {
  getUsers,
  getUser,
  add,
  update,
  remove,
} 