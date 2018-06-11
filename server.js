const express = require('express');


mongoose.connect('mongodb://localhost/cs10')
const server = express();

server.use(express.json());

server.get('/', (req, res) => {
    res.status(200).json({ api: 'running...' });
});

server.listen(8000, () => {
    console.log('\n*** API running on port 8K **\n');
})