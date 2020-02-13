
exports.seed = function(knex, Promise) {
  return knex('users').insert([   
    { username: "kam", password: "test"},
    { username: "sue", password: "test2"}
  ]);
};