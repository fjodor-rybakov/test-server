import * as errs from "restify-errors";

export function getProject(database, userId, next) {
    return new Promise(async (resolve, reject) => {
        let sql = `SELECT * FROM project WHERE id_project = ?`;
        await database.query(sql, [userId], function (err, result) {
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
                    where role.name = ?`;
        await database.query(sql, [role], function (err, result) {
            if (err) {
                return next(new errs.BadGatewayError(err));
            }
            return resolve(result);
        })
    })
}

export function getProjectTypesImpl(database, next) {
    return new Promise(async (resolve) => {
        let sql = `SELECT * FROM project_type`;
        await database.query(sql, function (err, res) {
            if (err) {
                return next(new errs.BadGatewayError(err));
            }
            return resolve(res);
        })
    })
}

export function createTaskImpl(database, next, data) {
    return new Promise(async () => {
        let sql = `INSERT INTO task VALUES 
        (null, ?, ?, ?, ?, ?)`;
        console.log(sql);
        const newData = [data.id_project, data.id_user_manager, data.description, data.time, data.title];
        await database.query(sql, newData, function (err) {
            if (err) {
                return next(new errs.BadGatewayError(err));
            }
        })
    })
}

export function createProjectImpl(database, next, data) {
    return new Promise(async (resolve) => {
        let sql = `INSERT INTO project VALUES 
        (null, ?, ${data.id_project_type}, ${data.id_user_client}, 'open', ?, ${data.is_private}, ${data.id_user_manager})`;
        const params = [data.description, data.title];
        await database.query(sql, params, function (err) {
            if (err) {
                return next(new errs.BadGatewayError(err))
            }
            return resolve();
        })
    })
}

export function addProjectTeam(database, next, developers, id) {
    let res = '';
    return new Promise(async (resolve) => {
        for (let i = 0; i < developers.length; i++) {
            let sql = `INSERT INTO project_and_user VALUES 
            (null, ?, ?)`;
            await database.query(sql, [developers[i].id_user, id], function (err, result) {
                if (err) {
                    return next(new errs.BadGatewayError(err));
                }
                res = result;
            })
        }
        return resolve(res);
    })
}

export function getLastInsertId(database, next) {
    return new Promise(async (resolve) => {
        const sql = `SELECT last_insert_id() as id`;
        database.query(sql, function (err, result) {
            if (err) {
                return next(new errs.BadGatewayError(err));
            }
            console.log(result);
            return resolve(result[0].id);
        });
    });
}

export function addTaskTeam(database, next, developers, id) {
    let res = '';
    return new Promise(async (resolve) => {
        for (let i = 0; i < developers.length; i++) {
            let sql = `INSERT INTO task_and_user VALUES 
            (null, ?, ?)`;
            console.log(sql);
            await database.query(sql, [id, developers[i].id_user], function (err, result) {
                if (err) {
                    return next(new errs.BadGatewayError(err));
                }
                res = result;
            })
        }
        return resolve(res);
    })
}