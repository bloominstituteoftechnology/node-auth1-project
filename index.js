//IMPORTS
const server = require( './api/server' );

//SERVER SETUP
const port = process.env.PORT || 4240;
server.listen( port , () => console.log( `\nAPI UP ON PORT ${port}\n` ));