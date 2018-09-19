const bcrypt = require('bcryptjs')
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('credentials').del()
    .then(function () {
      // Inserts seed entries
      return knex('credentials').insert([
        {username: 'bobheper1', password: bcrypt.hashSync('biallzabob',14)},
        {username: 'ricardo', password: bcrypt.hashSync('david',14)},
        {username: 'Greg', password: bcrypt.hashSync('mankiw',14)},
        {username: 'orungatan', password: bcrypt.hashSync('spatialmemory',14)},
        {username: 'eric', password: bcrypt.hashSync('elhricson',14)}
      ]);
    });
};
