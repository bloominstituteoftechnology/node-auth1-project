/* eslint no-console: 0 */
const { server } = require('./server.js');

server.listen(3000, () => console.log('Express running → PORT 3000'));
