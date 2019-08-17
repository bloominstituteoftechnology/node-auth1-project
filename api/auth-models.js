const db = require("../db-config.js");


module.exports = {
  getUsers,
  addUser,
  updateUser,
  deleteUser
};

function getUsers() {
  return db("users");
}

function addUser(newUser) {
  return db("User").insert(newUser, "id");
}

function updateUser(changes, id) {
  return db("User")
    .update(changes)
    .where({ id });
}

function deleteUser(id) {
  return db("User")
    .del()
    .where({ id });
}