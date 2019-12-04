const server = require("./server");

const PORT = process.env.PORT || 5000;
server.listen(PORT, (req, res) => {
  console.log(`Running on port: ${PORT}`);
});
