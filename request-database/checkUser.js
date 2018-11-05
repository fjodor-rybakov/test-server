import * as errs from "restify-errors";

export function checkUser(database, data, next) {
    return new Promise(async (resolve, reject) => {
        let sql = `SELECT * FROM user WHERE email = '${data.email}' AND password = '${data.password}'`;
        await database.query(sql, function (err, result) {
            if (err) {
                return next(new errs.BadGatewayError(err));
            }
            if (result.length === 0) {
                return reject(undefined);
            } else {
                return resolve(result);
            }
        })
    })
}