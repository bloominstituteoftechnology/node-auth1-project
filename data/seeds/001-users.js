
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('users').del()
  .truncate()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {id: 1, username: 'first',password:'pasWord'},
        {id: 2, username: 'second',password:'passWrd'},
        {id: 3, username: 'third',password:'passWod'}
      ]);
    });
};
