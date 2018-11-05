import mysql from "mysql";

const config = {
    name: 'order task',
    version: '0.0.1',
    port: process.env.PORT || 3001,
    db: {
        get: mysql.createConnection({
            host     : 'www.db4free.net',
            user     : 'qwerty251',
            password : 'qwerty123',
            database : 'ordertask'
        })
    },
    "jwt": {
        "secret": "&@$!changeme!$@&"
    }
};

export default config;