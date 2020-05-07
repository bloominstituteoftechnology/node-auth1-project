exports.seed = async function (knex) {
  await knex("users").truncate();
};
