
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('credentials').del()
    .then(function () {
      // Inserts seed entries
      return knex('credentials').insert([
        {username: 'bobheper1', password: 'biallzabob'},
        {username: 'ricardo', password: 'david'},
        {username: 'Greg', password: 'mankiw'},
        {username: 'orungatan', password: 'spatialmemory'},
        {username: 'eric', password: 'elhricson'}
      ]);
    });
};
