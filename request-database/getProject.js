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
        let sql = `SELECT user.last_name, user.first_name, user.id_user
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

export function createTaskImpl(database, next, data) {
    return new Promise(async (resolve) => {
        let sql = `INSERT INTO task VALUES 
        (null, ${data.id_project}, ${data.id_user_manager}, '${data.description}', ${data.time}, '${data.title}')`;
        console.log(sql);
        await database.query(sql, function (err) {
            if (err) {
                return next(new errs.BadGatewayError(err));
            }
            const sql = `SELECT last_insert_id() as id`;
            database.query(sql, function (err, result) {
                if (err) {
                    return next(new errs.BadGatewayError(err));
                }
                return resolve(result);
            });
        })
    })
}

export function addTaskTeam(database, next, developers, id) {
    let res = '';
    return new Promise(async (resolve) => {
        for (let i = 0; i < developers.length; i++) {
            let sql = `INSERT INTO task_and_user VALUES 
            (null, ${id}, ${developers[i].id_user})`;
            console.log(sql);
            await database.query(sql, function (err, result) {
                if (err) {
                    return next(new errs.BadGatewayError(err));
                }
                res = result;
            })
        }
        return resolve(res);
    })
}