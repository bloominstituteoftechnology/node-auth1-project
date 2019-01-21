const knex = require("knex");

const knexConfig = require("../../knexfile");

const db = knex(knexConfig.development);

module.exports = {
  find: () => {
    return db("users").select("id", "username").orderBy('id');
  },
  insert: (user) => {
    return db("users").insert(user);
  },
  findByUser: (username) => {
    return db("users").where("username", username);
  }
};
