
exports.seed = function(knex) {
      return knex('users').insert([
        {username: 'johnsnow', password: 'youknownothing'}
      ]);
};
