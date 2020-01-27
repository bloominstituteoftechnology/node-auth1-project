const bcrypt = require('bcryptjs');

exports.seed = function(knex) {
  return knex('user').truncate()
    .then(function () {
      // Inserts seed entries
      return knex('user').insert([
        {
          "username": "admin",
          "password": bcrypt.hashSync('admin', 11),
        },
        {
          "username": "maxwell",
          "password": bcrypt.hashSync('melqui', 11),
        },
      ]);
    });
};
