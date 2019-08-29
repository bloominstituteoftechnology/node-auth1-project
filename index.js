const server = require("./server.js");
console.log("Hey Harry!");

server.listen(5500, () => {
    console.log("Listening to server on PORT 5500");
});
