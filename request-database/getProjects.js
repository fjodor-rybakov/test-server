import * as errs from "restify-errors";

export function getProjects(database, next) {
    return new Promise(async (resolve) => {
        let sql = `SELECT * FROM project`;
        await database.query(sql, function (err, result) {
            if (err) {
                return next(new errs.BadGatewayError(err));
            }
            return resolve(result);
        })
    })
}