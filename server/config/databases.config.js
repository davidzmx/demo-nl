const config = {
    postgres: {
/*         inegi_dwh: {
            database: 'inegi_dwh',
            credentials: {
                user: 'postgres',
                host: '192.168.0.117',
                database: 'inegi_dwh',
                password: 'G301nt43',
                port: 5432,
            }
        }, */
        demo_nl: {
            database: 'red',
            credentials: {
                user: 'postgres',
                host: 'localhost',
                database: 'red',
                password: 'postgres',
                port: 5432,
            }
        }/*,
        inegi_public: { // change to the real credentials
            database: 'inegi_public',
            credentials: {
                user: 'sigcovid',
                host: 'localhost',
                database: 'sigcovid',
                password: 's1gc0v1d',
                port: 2222,
            }
        } */
    }
}

module.exports = config;
