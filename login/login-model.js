const bcryptjs = require("bcryptjs");
const db = require("../db-config.js");

module.exports = {
  findUser
};

function findUser(user) {
  return db("users")
    .where({ username: user.username })
    .first();
}
