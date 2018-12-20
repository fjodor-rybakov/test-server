import * as errs from "restify-errors";

export function getProjects(database, dataUser, next) {
    return new Promise(async (resolve) => {
        let sql = `SELECT * FROM project WHERE id_user_client = ?`;
        await database.query(sql, [dataUser.id_user], (err, result) => {
            if (err) {
                return next(new errs.BadGatewayError(err));
            }
            return resolve(result);
        })
    })
}