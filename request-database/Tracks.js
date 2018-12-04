import * as errs from "restify-errors";

export function getTracks(database, next, data) {
    return new Promise(async (resolve, reject) => {
        let sql = `SELECT * FROM track WHERE id_task = ${data.id_task}`;
        await database.query(sql, function (err, result) {
            if (err) {
                return next(new errs.BadGatewayError(err));
            }
            return resolve(result);
        })
    })
}

export function addTrack(database, next, data) {
    return new Promise(async (resolve, reject) => {
        let start_time = data.start_time + ":00.000";
        let end_time = data.end_time + ":00.000";
        let start_data = data.start_data + "T" + start_time;
        let end_data = data.end_data + "T" + end_time;
        let sql = `INSERT INTO track VALUES (null, ${data.id_user}, ?, '${start_data}', '${end_data}', ${data.id_task})`;
        await database.query(sql, [data.description], function (err, result) {
            if (err) {
                return next(new errs.BadGatewayError(err));
            }
            return resolve(result);
        });
    })
}