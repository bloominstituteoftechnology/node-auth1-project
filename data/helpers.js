const db = require('./dbConfig');

module.exports = {
  get: function() {
    return db.select('username').from('users');
  },
  getByUsername: function(username) {
    return db('users')
      .where({ username: username })
      .first();
  },
  addUser: function(user) {
    return db('users').insert(user);
  }
};
