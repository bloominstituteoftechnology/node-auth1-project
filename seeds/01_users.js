
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {id: 1, username: 'testUser1', password: 'test123'},
        {id: 2, username: 'testUser2', password: 'test1234'},
        {id: 3, username: 'testUser3', password: 'test12345'}
      ]);
    });
};
