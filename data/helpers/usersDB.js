const db = require('../dbConfig.js');

module.exports = {
  get: function(id) {
    let query = db('users').select();
    if (id) {
      query.where('id', id).first();
    }
    return query;
  },
  getByName: function(name) {
    return db('users')
      .select()
      .where('name', name)
      .first();
  },
};
