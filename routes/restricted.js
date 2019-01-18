const express = require('express');
const router = express.Router();
const knex = require('knex');

const dbConfig = require('../knexfile');

const mw = require('../middleware');

//router.use( mw.protect() );

router.get('/', mw.protect, (req,res) => {
  res.send("Logged into restricted area.");
});