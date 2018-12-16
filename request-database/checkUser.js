import * as errs from "restify-errors";
import config from "../config";

export function checkUser(database, data, next) {
    return new Promise(async (resolve, reject) => {
        let sql = `SELECT * FROM user WHERE email = ?`;
        await database.query(sql, [data.email], function (err, result) {
            if (err) {
                return next(new errs.BadGatewayError(err));
            }
            if (result.length === 0) {
                return reject(undefined);
            } else {
                try {
                    if (data.password === config.crypt.decrypt(result[0].password)) {
                        return resolve(result);
                    } else {
                        return reject(undefined);
                    }
                } catch (e) {
                    return reject(undefined);
                }
            }
        })
    })
}