import * as errs from "restify-errors";

export function getProject(database, data, next) {
    return new Promise(async (resolve, reject) => {
        let sql = `SELECT * FROM project WHERE id_project = ${data.id}`;
        await database.query(sql, function (err, result) {
            if (err) {
                return next(new errs.BadGatewayError(err));
            }
            if (result.length === 0) {
                return reject(undefined);
            } else {
                return resolve(result[0]);
            }
        })
    })
}