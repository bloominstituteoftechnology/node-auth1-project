
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('authentication').truncate()
    .then(function () {
      // Inserts seed entries
      return knex('authentication').insert([
        {username: 'xxh@ck3rxx', password: 'pass123'},
        {username: 'pumpkinhead', password: 'mydogmax'},
        {username: 'heckboy', password: 'pa55word'}
      ]);
    });
};
