const express = require("express");
const db = require("./dbConfig");

module.exports = {
  insertUser,
  findByUsername,
  findUsers
};

function insertUser(user) {
  return db("users").insert(user);
}

function findByUsername(username) {
  return db("users").where("username", username);
}
function findUsers() {
  return db("users").then(response => {
    const mapped = response.map(x => {
      return x.username;
    });
    return mapped;
  });
}
