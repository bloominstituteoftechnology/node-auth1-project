const server = require("./server");

const thisServer = require("./server");

thisServer.get("/", (req, res) => {
  res.status(200).json({ Data: "WORKING" });
});
