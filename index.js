const express = require("express");
const server = express();
const authRouter = require("./auth/authRouter");
const logger = require("./Goldberg")

server.use(express.json());
server.use(logger)
server.use("/api", authRouter);

server.get("/", (req, res) => {
  res.status(200).json({ message: "Possible endpoints; /api/register - /api/login" });
});

const PORT = 8080;

server.listen(PORT, () => {
  console.log(`server listening at http://localhost:${PORT}...`);
});