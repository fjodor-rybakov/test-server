import * as errs from "restify-errors";
import config from "../config";

export function checkUser(database, data, next) {
    return new Promise(async (resolve) => {
        let sql = `SELECT * FROM user WHERE email = ?`;
        await database.query(sql, [data.email], (err, result) => {
            if (err) {
                return next(new errs.BadGatewayError(err));
            }
            if (result.length === 0) {
                return next(new errs.BadRequestError("User not found"));
            } else {
                try {
                    if (data.password === config.crypt.decrypt(result[0].password)) {
                        return resolve(result);
                    } else {
                        return next(new errs.BadRequestError("Incorrect password"))
                    }
                } catch (e) {
                    return next(new errs.BadRequestError("Incorrect password"))
                }
            }
        })
    })
}