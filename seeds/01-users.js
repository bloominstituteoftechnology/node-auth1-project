
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('users').truncate()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {username: 'test1',password:'password1'},
        {username: 'test2',password:'password2'},
        
      ]);
    });
};
