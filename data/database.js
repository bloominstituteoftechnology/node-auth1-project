const mongoose = require('mongoose');
// hey let's make some changes in here 

module.exports = {
    connectTo: function (database = 'sandbox', host = 'localhost') {
        return mongoose.connect(`mongodb://${host}/${database}`);
    }
}