
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {username: 'usernameone', password:'wrwer2525rtfgwij'},
        {username: 'usernametwo', password:'wrwer2525rtfdfsdf'},
        {username: 'usernamethree', password:'wrwer2525rtfgwdsdfsdfij'}
      ]);
    });
};
