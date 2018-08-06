const db = require('../dbConfig.js');

module.exports = {
  get: function() {
    return db('users').select();
  },
};
