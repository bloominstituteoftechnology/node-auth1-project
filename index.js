const express = require("express");
const cors = require("cors");
const knex = require("knex");
const bcrypt = require("bcryptjs");

const db = require("./lambda.sqlite3");

const server = express();
