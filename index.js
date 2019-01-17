const express = require('express');
const server = express();

const loginRouter = require('./routes/loginRoutes');

const PORT = process.env.PORT || 3800;

server.use(express.json());

server.use('/api', loginRouter);

//SERVER

server.listen(PORT, () => {
    console.log(`Server is listening on ${PORT}`)
});
