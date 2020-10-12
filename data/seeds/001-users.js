exports.seed = function (knex) {
  // Inserts seed entries
  return knex("users").insert([
    { username: "Sam", password: "pass" },
    { username: "Pam", password: "pass123" },
    { username: "Tick", password: "notapass" },
  ]);
};
