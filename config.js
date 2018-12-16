import mysql from "mysql"
const Cryptr = require('cryptr');

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
    },
    crypt: new Cryptr("Qw123o@!f")
};

export default config;