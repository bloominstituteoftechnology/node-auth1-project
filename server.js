const express = require("express");
const SERVER = express();
const PORT = process.env.PORT || 3300;

const auth = require("./routers/auth");

SERVER.use(express.json());
SERVER.use("/api/", auth);

SERVER.listen(PORT, () => {
  console.log(`Listening on PORT:${PORT}`);
});
