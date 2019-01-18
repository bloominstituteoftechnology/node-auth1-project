
exports.seed = function(knex, Promise) {
    return knex('Users').truncate()
      .then(function () {
        return knex('Users').insert([
          {Username: "roBot", Password: "Secret!143"},
          {Username: "automatizer", Password: "R0b1n143!"},
          {Username: "optimizer", Password: "NIBORhoods123"},
          {Username: "transformer", Password: "NIBORhoods14344!"},
        ]);
      });
  };