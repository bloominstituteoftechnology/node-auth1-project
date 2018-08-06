const db = require("../db");
const mappers = require("../helpers/mappers");
const tbl = 'users';

module.exports = {
    get: function (record) {
        let query = db(`${tbl} as t`);

        if (record) {
            query.where("t.username", record.username).first();

            const promises = [query];

            return Promise.all(promises).then(function (results) {
                let [record] = results;
                
                return mappers.recordToBody(record);
            });
        }

        return query.then(records => {
            return records.map(record => mappers.recordToBody(record));
        });
    }
};
