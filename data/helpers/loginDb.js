const db = require("../db");
const mappers = require("../helpers/mappers");
const tbl = 'dishes';

module.exports = {
    get: function (id) {
        let query = db(`${tbl} as t`);

        if (id) {
            query.where("t.id", id).first();

            const promises = [query, this.getSubRecords(id)];

            return Promise.all(promises).then(function (results) {
                let [record, subRecords] = results;
                record.recipes = subRecords;

                return mappers.recordToBody(record);
            });
        }

        return query.then(records => {
            return records.map(record => mappers.recordToBody(record));
        });
    },
    getSubRecords: function (id) {
        return db('recipes as r')
            .where('r.dishes_id', id)
            .then(records => records.map(record => mappers.recordToBody(record)));
    },
    add: function(record) {
        return db(tbl)
            .insert(record)
            .then(([id]) => this.get(id));
    },
    edit: function(id, changes) {
        return db(tbl)
            .where('id', id)
            .update(changes)
            .then(count => (count > 0 ? this.get(id) : null));
    },
    drop: function(id) {
        return db(tbl)
            .where('id', id)
            .del();
    }
};
