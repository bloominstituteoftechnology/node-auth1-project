
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users').truncate()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {username: 'test-name', password: 'test-password'},
        {username: 'test-name1', password: 'test-password1'},
        {username: 'test-name2', password: 'test-password2'}
      ]);
    });
};
