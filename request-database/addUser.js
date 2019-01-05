import * as errs from "restify-errors";
import config from "../config";

export function addUser(database, data, next) {
    return new Promise((resolve, reject) => {
        let sql = `SELECT * FROM user WHERE email = ?`;
        database.query(sql, [data.email], (err, result) => {
            if (err) {
                return reject(new errs.BadGatewayError(err));
            }
            if (result.length !== 0) {
                return reject(new errs.BadRequestError("Email already exist"));
            }
        });

        sql = `INSERT INTO user VALUES 
        (null, '', '', ?, '', ?, ?, 'resources/default-avatar.png')`;
        database.query(sql, [data.role, config.crypt.encrypt(data.password), data.email], (err) => {
            if (err) {
                return next(new errs.BadGatewayError(err));
            }
            return resolve();
        });
    });
}