const db = require('../dbConfig.js');

module.exports = {
  get: function(id) {
    let query = db('actions').select(
      'id',
      'description',
      'notes',
      'done as completed',
    );
    if (id) {
      query.where('id', Number(id)).first();
    }

    return query;
  },
  getContexts: function(id) {
    return db
      .select('c.name')
      .from('actions as a')
      .join('actions_contexts as ac', 'a.id', 'ac.a_id')
      .join('contexts as c', 'ac.c_id', 'c.id')
      .where('a.id', id);
  },
  getPK: function(id) {
    return (query = db('actions')
      .select('id', 'description', 'notes', 'done as completed')
      .where('p_id', Number(id)));
  },
  insert: function(action) {
    return db('actions')
      .insert(action)
      .then(ids => ({ id: ids[0] }));
  },
  update: function(id, action) {
    return db('actions')
      .where('id', id)
      .update(action);
  },
  remove: function(id) {
    return db('actions')
      .where('id', id)
      .del();
  },
};
