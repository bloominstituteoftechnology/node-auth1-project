//IMPORTS
const db = require( '../data/dbConfig' );

//EXPORTS
module.exports = {
    add,
    find,
    findBy,
    findById,
};

//FUNCTIONS
function find() {
    return db( 'users' ).select( 'id' , 'username' , 'password' );
}

function findBy( filter ) {
    return db( 'users' ).where( filter );
}

async function add( user ) {
    const [id] = await db( 'users' ).insert( user );

    return findById( id );
}

function findById( id ) {
    return db( 'users' )
        .where({ id })
        .first();
}