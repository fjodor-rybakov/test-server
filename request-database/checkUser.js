import * as errs from "restify-errors";
import Utils from "../utils/Utils";

export function checkUser(database, data, next) {
    return new Promise(async (resolve) => {
        let sql = `SELECT * FROM user WHERE email = ?`;
        database.query(sql, [data.email], (err, result) => {
            if (err) {
                return next(new errs.BadGatewayError(err));
            }
            if (result.length === 0) {
                return next(new errs.BadRequestError("User not found"));
            } else {
                return resolve(Utils.checkPassword(data.password, result, next));
            }
        })
    })
}