
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('users').truncate()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {id: 1, username: 'jake', password:'admin'},
        {id: 2, username: 'mike',password:"wednesday"},
        {id: 3, username: 'Madam TL', password:'sara'}
      ]);
    });
};
