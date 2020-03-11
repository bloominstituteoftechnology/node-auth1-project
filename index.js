const server = require('./server');
const apiRoutes = require('./api/apiRoutes');

const PORT = process.env.PORT || 4040;

server.use('/api', apiRoutes);

server.listen(PORT, () =>{
    console.log(`The server is running on ${PORT}`)
})