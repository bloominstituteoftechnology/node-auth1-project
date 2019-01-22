const server = require("./api/server.js");

const port = process.env.PORT || 4500;
server.listen(port, () => console.log("\nrunning on port 4500\n"));
