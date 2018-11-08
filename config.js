import mysql from "mysql";

const config = {
    name: 'order task',
    version: '0.0.1',
    port: process.env.PORT || 3001,
    db: {
        get: mysql.createConnection({
            host     : 'localhost',
            user     : 'root',
            password : 'qwerty123',
            database : 'site'
        })
    },
    "jwt": {
        "secret": "&@$!changeme!$@&"
    }
};

export default config;