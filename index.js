const express = require('express');


const server = express();

require('./middleware')(server)
require('./api/routeApis')(server);


server.listen(9000, () => console.log('Server is UP at 9000'));

