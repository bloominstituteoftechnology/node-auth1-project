const mongoose = require('mongoose');
const config = require('./config.js');

const { dbuser, dbpassword, dbname } = config.secret
// console.log(config.secret)

const server = `mongodb://${dbuser}:${encodeURIComponent(dbpassword)}@ds016718.mlab.com:16718/${dbname}`

// module.exports = {
//   connectTo: function(database = 'sandbox', host = 'localhost') {
//     return mongoose.connect(`mongodb://${host}/${database}`);
//   },
// };

module.exports = server
