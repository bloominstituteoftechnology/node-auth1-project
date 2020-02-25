const db = require("../data/db-config");

module.exports = {
  addUser
};

function addUser(newUser) {
  return db("users").insert(newUser);
}