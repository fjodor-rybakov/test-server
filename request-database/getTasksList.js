import * as errs from "restify-errors";

export function getTasksList(database, next, projectId) {
    return new Promise(async (resolve) => {
        let sql = `SELECT * FROM task WHERE id_project = ?`;
        await database.query(sql, [projectId], (err, result) => {
            if (err) {
                return next(new errs.BadGatewayError(err));
            }
            return resolve(result);
        })
    })
}