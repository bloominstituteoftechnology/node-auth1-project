const express = require("express");
const server = express();
const authRouter = require("./auth/authRouter");

server.use(express.json());
server.use("/api", authRouter);

server.get("/", (req, res) => {
  res.status(200).json({ message: "Possible endpoints; /api/register" });
});

const PORT = 8080;

server.listen(PORT, () => {
  console.log(`server listening at http://localhost:${PORT}...`);
});