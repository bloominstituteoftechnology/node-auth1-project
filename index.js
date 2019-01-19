const express = require('express');
const cors = require('cors');

//PORT
const PORT = 8000;
//Service
const service = express();
const register = require('./data/routes/register');
const login = require('./data/routes/login');
const users = require('./data/routes/users');
//Middleware
service.use(express.json());
service.use(cors());
service.use(register);
service.use(login);
service.use(users)

service.get('/', (req,res) => {
    res.status(200).json(`We are live now here.`);
});





service.listen(PORT, () => {
   console.log(`Server is running at http://localhost${PORT}`);
})
