const knex = require('knex');

const knexConfig = require('../knexfile.js');

const db = knex(knexConfig.development);

function insertUser(){

}

function findByUsername(){

}

module.exports = {
   insertUser, findByUsername
}