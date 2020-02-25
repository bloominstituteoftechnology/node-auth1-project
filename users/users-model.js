const db = require("../data/db-config");

module.exports = {
  getUsers
};

function getUsers() {
  return db("users");
}
