
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {id: 1, userName: 'Sean Tyas', userLogged: false},
        {id: 2, userName: 'Leon Mance', userLogged: false},
        {id: 3, userName: 'Taylor Goose', userLogged: false}
      ]);
    });
};
