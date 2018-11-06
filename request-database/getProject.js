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

export function getUserListByRole(database, next, role) {
    return new Promise(async (resolve) => {
        let sql = `SELECT user.last_name, user.first_name
                    FROM role
                    LEFT JOIN user 
                    on user.id_role = role.id_role
                    where role.name = '${role}'`;
        await database.query(sql, function (err, result) {
            if (err) {
                return next(new errs.BadGatewayError(err));
            }
            return resolve(result);
        })
    })
}