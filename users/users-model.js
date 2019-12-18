const db = require("../db-config");

module.exports = {
  getAllUsers,
  findUser
};

function getAllUsers() {
  return db("users");
}

function findUser(user) {
  return db("users")
    .where({ username: user.username })
    .first();
}
