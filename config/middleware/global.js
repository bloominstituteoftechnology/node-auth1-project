const express			= require('express');
const cors				= require('cors');
const helmet			= require('helmet');
const morgan			= require('morgan');
const restricted		= require('./restricted.js');
const session			= require('./sessionConfig.js');

module.exports = (server) => {
	server.use(
		express.json(),
		cors({ credentials: true, origin: 'http://localhost:3000' }),
		helmet(),
		morgan('tiny'),
		session,
		restricted,
	);
};
