const db = require('../dbConfig.js');

module.exports = {
  get: function(name) {
    let query = db('users').select('name', 'password');
    if (name) {
      query.where('name', name).first();
    }
    return query;
  },
};
