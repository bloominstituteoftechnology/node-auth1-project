
exports.up = function(knex, Promise) {
    return knex.schema.createTable('users', users => {
	users.increments();
	users
	    .string('username', 128)
	    .notNullable()
	    .unique();
	users.string('password', 128).notNullable();
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTableIfExists('users');
};


function rotateImage(arr) {
    // reverse the rows
    let matrix = arr;
    matrix = matrix.reverse();
    
    // swap the symmetric elements
    for (var i = 0; i < matrix.length; i++) {
	for (var j = 0; j < i; j++) {
	    var temp = matrix[i][j];
	    matrix[i][j] = matrix[j][i];
	    matrix[j][i] = temp;
	}
    }
    return matrix;
}
