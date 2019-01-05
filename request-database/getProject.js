import * as errs from "restify-errors";

export function getProject(database, userId, next) {
    return new Promise(async (resolve) => {
        let sql = `SELECT * FROM project WHERE id_project = ?`;
        database.query(sql, [userId], (err, result) => {
            if (err) {
                return next(new errs.BadGatewayError(err));
            }
            if (result.length === 0) {
                return next(new errs.BadRequestError("Project not found"));
            } else {
                return resolve(result[0]);
            }
        })
    })
}

export function getTaskById(database, id, next) {
    return new Promise(async (resolve) => {
        let sql = `SELECT * FROM task WHERE id_task = ?`;
        await database.query(sql, [id], (err, result) => {
            if (err) {
                return next(new errs.BadGatewayError(err));
            }
            console.log(id);
            if (result.length === 0) {
                return next(new errs.BadRequestError("Task not found"));
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
        await database.query(sql, [role], (err, result) => {
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
        database.query(sql, (err, res) => {
            if (err) {
                return next(new errs.BadGatewayError(err));
            }
            return resolve(res);
        })
    })
}

export function createTaskImpl(database, next, data) {
    return new Promise(async (resolve) => {
        let sql = `INSERT INTO task VALUES 
        (null, ?, ?, ?, ?, ?, 'open')`;
        console.log(sql);
        const newData = [data.id_project, data.id_user_manager, data.description, data.time, data.title];
        await database.query(sql, newData, (err) => {
            if (err) {
                return next(new errs.BadGatewayError(err));
            }
            return resolve();
        })
    })
}

export function createProjectImpl(database, next, data) {
    return new Promise((resolve) => {
        let sql = `INSERT INTO project VALUES 
        (null, ?, ${data.id_project_type}, ${data.id_user_client}, 'open', ?, ${data.is_private}, ${data.id_user_manager})`;
        const params = [data.description, data.title];
        database.query(sql, params, (err, result) => {
            if (err) {
                return next(new errs.BadGatewayError(err))
            }
            return resolve(result.insertId);
        })
    })
}

export function addProjectTeam(database, next, developers, project_id) {
    let res = '';
    return new Promise(async (resolve) => {
        for (let i = 0; i < developers.length; i++) {
            console.log(developers[i].id_user, project_id);
            let sql = `INSERT INTO project_and_user VALUES 
            (null, ?, ?)`;
            await database.query(sql, [developers[i].id_user, project_id], (err, result) => {
                if (err) {
                    console.log(err);
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
        await database.query(sql, function (err, result) {
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
            let sql = `INSERT INTO task_and_user VALUES (null, ?, ?)`;
            await database.query(sql, [id, developers[i].id_user], (err, result) => {
                if (err) {
                    return next(new errs.BadGatewayError(err));
                }
                res = result;
            })
        }
        return resolve(res);
    })
}