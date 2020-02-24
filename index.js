require("dotenv").config();
const server = require("./api/server"); // <-- The magic will come from this file 🧙🏾‍♂️
const PORT = process.env.PORT || 9000;
server.listen(PORT, console.log(`\n*** IT'S OVER ${PORT} ***\n`));
