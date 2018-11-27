const db = require('./dbConfig');

module.exports = {
  getByUsername: function(username) {
    return db('users')
      .where({ username: username })
      .first();
  },
  addUser: function(user) {
    return db('users').insert(user);
  }
};
