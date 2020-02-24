const db = require('./db-config');

module.exports = {
  find, 
  add,
  login
};

function find() {
  return db("users");
}

function add(user) {
    return db('users').insert(user);
}

function login(user) {
    return db('users').where(user);
}