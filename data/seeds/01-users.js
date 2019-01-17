
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('user').truncate()
    .then(function () {
      // Inserts seed entries
      return knex('tuser').insert([
        {userName: 'LarryJune', password: '12345678'},
        {userName: 'JazzyJaz', password: '1234abcde'},
      ]);
    });
};
