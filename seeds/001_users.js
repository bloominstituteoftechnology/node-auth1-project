
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {username: "John", password: 'rowValue1'},
        {username: "Sally", password: 'rowValue2'},
        {username: "Sandra", password: 'rowValue3'}
      ]);
    });
};
