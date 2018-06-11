const mongoose = require('mongoose');

module.exports = mongoose.connect('mongodb://localhost/authi', error => {
  error
    ? console.log('\n*** ERROR connecting to database ***\n', error)
    : console.log('\n*** CONNECTED to database ***\n');
});