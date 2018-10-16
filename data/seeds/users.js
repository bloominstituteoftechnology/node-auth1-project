
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {username: 'clint', password: 'test', level_of_security: 2},
        {username: 'bob', password: 'test', level_of_security: 1},
        {username: 'lauren', password: 'test', level_of_security: 1}
      ]);
    });
};
