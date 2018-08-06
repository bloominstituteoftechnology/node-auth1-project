
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {username: 'firstnamelastname1', password: 'rowValue1'},
        {username: 'firstnamelastname2', password: 'rowValue2'},
        {username: 'firstnamelastname3', password: 'rowValue3'}
      ]);
    });
};
