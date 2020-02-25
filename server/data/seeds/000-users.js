
exports.seed = function(knex) {
  return knex('users').truncate()
    .then(function () {
      return knex('users').insert([
        {username: 'MosesIn.Tech', password: 'password'},
        {username: 'Elegant Totality', password: 'anotherpass'}
      ]);
    });
};
