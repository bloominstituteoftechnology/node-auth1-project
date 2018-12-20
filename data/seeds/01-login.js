exports.seed = function(knex, Promise) {
  return knex("authentication")
    .truncate()
    .then(function() {
      // Inserts seed entries
      return knex("authentication").insert([
        {
          username: "cpdis",
          password:
            "tWVRcWZQbgoPqUcawEnf7mprAmywVsQ9TYyK3TCCYRgXXkAugZEwrixuyy6fndmk"
        },
        { username: "colindismuke", password: "12345" },
        { username: "username", password: "password" }
      ]);
    });
};
