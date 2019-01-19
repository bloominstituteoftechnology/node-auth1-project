const express = require("express");
const db = require("./dbConfig");

module.exports = {
  insertUser: user => {
    return db("users").insert(user);
  },

  findByUsername: username => {
    return db("users").where("username", username);
  },

  findUsers: () => {
    return db("users").select("id", "username");
  }
};
