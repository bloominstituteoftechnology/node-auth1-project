exports.seed = function(knex) {
    // Deletes ALL existing entries
    const users = [
      {id: 1, username: 'sam', password: 'sepiole'},
    ]
    return knex('users').del()
      .then(function () {
        // Inserts seed entries
        return knex('users').insert(users);
      });
  };