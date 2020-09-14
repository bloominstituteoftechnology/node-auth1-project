const server = require("./api/server"); 

const port = process.env.PORT || 2050; 

server.listen(port, () => console.log(`server running on port ${port}`));
