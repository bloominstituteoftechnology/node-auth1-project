const server = require('./api/server');

const PORT = 2000;


server.listen(PORT, ()=>{
    console.log(`Server is listening on PORT : ${PORT}`)
})
