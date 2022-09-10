const { Pool } = require('pg')

const postgres = {};

postgres.start = (config) => {
	
	postgres.databasePool = getPool(config.credentials);
	
/*     switch (config.credentials.database) {
        case 'miapptsil':
            postgres.databasePool = getPool(config.credentials);
            break;
        default:
            console.log('Invalid database');
    } */
};

const getPool = credentials => {
    const pool = new Pool(credentials);

    pool.query('SELECT NOW()')
        .then(res => console.log(`Postgres (${credentials.database}) is connected`))
        .catch(err => console.error(err))

    return pool;
}

module.exports = postgres;
