import * as errs from "restify-errors";

export function getProfile(database, id_user, next) {
    return new Promise(async (resolve) => {
        let sql = `SELECT * FROM user WHERE id_user = ?`;
        database.query(sql, [id_user], function (err, result) {
            if (err) {
                return next(new errs.BadGatewayError(err));
            }
            if (result.length === 0) {
                return next(new errs.BadRequestError("Not found user data"));
            } else {
                return resolve(result);
            }
        })
    })
}

export function getRole(database, id_role, next) {
    return new Promise(async (resolve) => {
        let sql = `SELECT * FROM role WHERE id_role = ?`;
        database.query(sql, [id_role], function (err, result) {
            if (err) {
                return next(new errs.BadGatewayError(err));
            }
            console.log(result);
            if (result.length === 0) {
                return next(new errs.BadRequestError("Not found user data"));
            } else {
                return resolve(result);
            }
        })
    })
}

export function getRoles(database,  next) {
    return new Promise(async (resolve) => {
        let sql = `SELECT * FROM role`;
        database.query(sql,function (err, result) {
            if (err) {
                return next(new errs.BadGatewayError(err));
            }
            return resolve(result);
        })
    })
}