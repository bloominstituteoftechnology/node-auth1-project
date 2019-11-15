const db = require("./db-config");

function find() {
  return db("users");
}

module.exports = { find };
