exports.seed = function (knex) {
  // Inserts seed entries
  return knex("users").insert([
    { username: "Ramsha", password: "pass" },
    { username: "John", password: "J123" },
    { username: "Sammy", password: "2461S" },
  ]);
};