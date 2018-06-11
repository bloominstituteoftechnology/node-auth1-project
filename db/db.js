const mongoose = require('mongoose');

module.exports = {
  connectTo: function(database = 'sandbox', host = 'localhost') {
    return mongoose.connect(
      `mongodb://${host}/${database}`,
      () => {
        console.log('\n**** Et voilà, we have direct line with the database! ****\n');
      }
    );
  },
};
