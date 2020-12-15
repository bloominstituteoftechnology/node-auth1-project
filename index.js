require("dotenv").config();

const server = require("./users/server");

const port = process.env.PORT || 5000;
server.listen(port, () => console.log(`\n** Running on port ${port} **\n`));