require('dotenv').config();
const server = require('./api/server.js');
const port = process.env.PORT;

server.get('/', (req, res) => {
    res.status(200).json({message: `Check out /api/users or don't. Your call, really.`});
})

server.listen(port, () => {
    console.log(`API running good on port ${port}`);
});