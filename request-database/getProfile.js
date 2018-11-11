import * as errs from "restify-errors";

export function getProfile(database, id_user, next) {
    return new Promise(async (resolve, reject) => {
        let sql = `SELECT * FROM user WHERE id_user = ?`;
        await database.query(sql, [id_user], function (err, result) {
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