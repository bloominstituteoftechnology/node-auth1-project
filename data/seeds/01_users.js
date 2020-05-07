exports.seed = async function (knex) {
  await knex("users").insert([
    { username: "big_homie_001", password: "W3lcom3" },
    { username: "Darksouja18", password: "password" },
  ]);
};
