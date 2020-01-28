exports.seed = function(knex) {
  return knex('users').insert([
    {id: 1, username: 'ethan', password: '123'},
    {id: 2, username: 'leia', password: '1234'},
    {id: 3, username: 'josh', password: '12345'}
  ]);
};
