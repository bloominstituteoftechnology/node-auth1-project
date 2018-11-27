const db = require('../../database/dbConfig');

module.exports = {
  registerUser: function(credentials) {
    db('users')
      .insert(credentials)
      .then(ids => ({ id: ids[0] }));
  },
  login: function(credentials) {
    db('users')
      .where({ username: credentials.username })
      .first();
  }
};
