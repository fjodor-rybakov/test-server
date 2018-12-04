import * as errs from "restify-errors";

export function getTasksList(database, next, data) {
    return new Promise(async (resolve, reject) => {
        let sql = `SELECT * FROM task WHERE id_project = ?`;
        await database.query(sql, [data.id], function (err, result) {
            if (err) {
                return next(new errs.BadGatewayError(err));
            }
            return resolve(result);
        })
    })
}