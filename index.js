// require("dotenv").config();
//already on package.json file - global
const server = require("./api/server");

//PORT 5000
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...*****`);
});
