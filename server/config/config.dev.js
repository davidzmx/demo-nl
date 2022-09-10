const config = {
	PORT: 3008,
    postgres: {
        database: {
            credentials: {
                database: 'red',
                //host: '192.168.1.51',
                host: 'localhost',
                port: 5432,
                user: 'postgres',
                password: 'postgres',
            }
        }
    }
}

module.exports = config;
