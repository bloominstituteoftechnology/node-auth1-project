const express = require('express');
const db = require('./dbConfig');

module.exports = {
  insertUser,
  findByUsername,
  getUsers
};

function insertUser(user) {
  return db('users').insert(user);
}

function findByUsername(username) {
  return db('users').where('username', username);
}

function getUsers() {
  return db('users').select('id', 'username');
}
