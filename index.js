const server = require("./server");

//port 8000
const port = 8000;
server.listen(port, () => {
  console.log(`server is listening on port ${port}...`);
});
