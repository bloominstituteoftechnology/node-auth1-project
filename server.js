const express = require("express");
const cors = require("cors");
const SERVER = express();
const PORT = process.env.PORT || 3300;

const auth = require("./routers/auth");

SERVER.use(express.json(), cors());
SERVER.use("/api/", auth);

SERVER.listen(PORT, () => {
  console.log(`Listening on PORT:${PORT}`);
});
