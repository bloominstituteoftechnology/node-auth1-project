// WEB API MIDDLEWARE
// ==============================================
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

module.exports = app => {
	app.use(express.json());
  app.use(cors());
	app.use(helmet());
};
