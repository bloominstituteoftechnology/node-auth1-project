
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('roles').truncate()
    .then(function () {
      // Inserts seed entries
      return knex('roles').insert([
        { name: 'admin'},
        { name: 'user'}
      ]);
    });
};
