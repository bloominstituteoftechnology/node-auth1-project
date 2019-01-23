const knex = require("knex");

const knexConfig = require("../knexfile");

const db = knex(knexConfig.development);

const addUser = user => {
  return db("users").insert(user);
};

const findByUsername = username => {
  return db("users").where("username", username);
};

const findUsers = () => {
  return db("users").select("id", "username");
};

module.exports = {
  addUser,
  findByUsername,
  findUsers
};
