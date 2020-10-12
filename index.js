const server = require("./Api/server");

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`API LISTENING ON ${PORT}`);
});
module.exports = server;
