const express = require("express");
const db = require("./dbConfig");

module.exports = {
  insertUser,
  findByUsername
};

function insertUser(user) {
  return db("users").insert(user);
}

function findByUsername(username) {
  return db("users").where("username", username);
}
