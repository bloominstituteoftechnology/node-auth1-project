const db = require('../../database/dbConfig');

module.exports = {
  checkCredentials: function(username) {
    return db('users')
      .where('username', username)
      .first();
  },
  registerUser: function(credentials) {
    return db('users')
      .insert(credentials)
      .then(ids => ({ id: ids[0] }));
  },
  get: function() {
    return db('users').select('id', 'username');
  }
};
