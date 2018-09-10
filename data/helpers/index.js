const db = require('../dbConfig.js');
const bcrypt = require('bcryptjs');

module.exports = {
  register: function(user) {
    const hash = bcrypt.hashSync(user.password, 14);
    user.password = hash;

    return db('users')
      .insert(user)
      .then(ids => ({
        id: ids[0],
      }));
  },

  login: function(user) {
    return db('users')
      .where({ username: user.username })
      .first()
      .then(res => {
        return res && bcrypt.compareSync(user.password, res.password);
      });
  },
};
