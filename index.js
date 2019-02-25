const server = require('./server.js');

// const express = require('express');
// const helmet = require('helmet');

// const bcrypt = require('bcryptjs');

// const db = require('./data/dbConfig.js');
// const Users = require('./users/users-model.js');

// const server = express();

// server.use(helmet());
// server.use(express.json());

// server.get('/', (req, res) => {
//     res.send("We did the mash ---- we did the Monster Mash!");
// });

const port = process.env.PORT || 4000;
server.listen(port, () => {
    console.log(`\n*** Server running on port ${port} ***\n`);
});