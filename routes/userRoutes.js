const express = require("express");
const router = express.Router();
const db = require("../db/dbConfig");
const bcrypt = require("bcryptjs");

const knex = require("knex");
const knexConfig = require("../knexfile");

module.exports = knex(knexConfig.development);
