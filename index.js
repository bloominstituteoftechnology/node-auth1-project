require("dotenv").config();

const server = require("./server/server");
const PORT = process.env.PORT || 5000

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = server