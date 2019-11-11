const server = require('./server')
const port = process.env.PORT || 4800

server.listen(port, ()=>{
    console.log(`Listening on port ${port}`)
}) 