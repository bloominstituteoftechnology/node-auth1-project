const db = require("../dbConfig");

module.exports = {
  get: () => {
    return db("users");
  },
  insert: (user) => {
    return db("users")
    .insert(user)
    .then(ids => ({id: ids[0]}))
  },
  findByUsername: (username) => {
    return db('users').where('username', username);
  }
}