import * as errs from "restify-errors";

export function addUser(database, data, next) {
    return new Promise(async (resolve, reject) => {
        let sql = `SELECT * FROM user WHERE email = '${data.email}'`;
        await database.query(sql, function (err, result) {
            if (err) {
                return next(new errs.BadGatewayError(err));
            }
            if (result.length !== 0) {
                return reject(false);
            }
        });

        sql = `INSERT INTO user VALUES 
        (null, '', '', 1, '', '${data.password}', '${data.email}', '${"resources/default-avatar.png"}')`;
        await database.query(sql, function (err) {
            if (err) {
                return next(new errs.BadGatewayError(err));
            }
            return resolve(true);
        });
    });
}