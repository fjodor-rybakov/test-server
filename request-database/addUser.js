import * as errs from "restify-errors";
import config from "../config";

export function addUser(database, data, next) {
    return new Promise(async (resolve, reject) => {
        let sql = `SELECT * FROM user WHERE email = ?`;
        await database.query(sql, [data.email],  function (err, result) {
            if (err) {
                return next(new errs.BadGatewayError(err));
            }
            if (result.length !== 0) {
                return reject(false);
            }
        });

        sql = `INSERT INTO user VALUES 
        (null, '', '', 1, '', ?, ?, 'resources/default-avatar.png')`;
        await database.query(sql, [config.crypt.encrypt(data.password), data.email], function (err) {
            if (err) {
                return next(new errs.BadGatewayError(err));
            }
            return resolve(true);
        });
    });
}