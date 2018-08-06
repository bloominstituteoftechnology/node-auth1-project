const db = require("../db");
const mappers = require("../helpers/mappers");
const tbl = 'users';

module.exports = {
    add: function(record) {
        return db(tbl)
            .insert(record);
            // .then(([id]) => this.get(id));
    }
};
