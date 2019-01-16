const express = require('express');
const db = require('./dbConfig');

module.exports = {
  insertUser
};

function insertUser(user) {
  return db('users').insert(user);
}
