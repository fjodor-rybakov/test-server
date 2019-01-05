import * as errs from "restify-errors";

export function getCreateProjectPermission(database, id, next) {
    return new Promise(async (resolve) => {
        let sql = `select name from role where id_role = ${id}`;
        await database.query(sql, (err, result) => {
            if (err) {
                return next(new errs.BadGatewayError(err));
            }
            if (result.length === 0) {
                return next(new errs.BadRequestError("Role not found"));
            }
            if (result[0].name === 'project manager' || result[0].name === 'client') {
                return resolve(true);
            } else {
                return resolve(false);
            }
        })
    })
}

export function getCreateTrackPermission(database, idUser, idTask, next) {
    return new Promise(async (resolve) => {
        let sql = `SELECT * FROM task
                   LEFT JOIN task_and_user 
                   on task_and_user.id_task = task.id_task
                   where (id_user = ${idUser} or task.id_user_manager = ${idUser}) and id_task = ${idTask}`;
        await database.query(sql, (err, result) => {
            if (err) {
                return next(new errs.BadGatewayError(err));
            }
            if (result.length === 0) {
                return resolve(false);
            } else {
                return resolve(true);
            }
        });
        return resolve();
    })
}

export function getCreateTaskPermission(database, idUser, idProject, next) {
    return new Promise(async (resolve) => {
        let sql = `SELECT * FROM project where id_project_manager = ${idUser} and id_project = ${idProject}`;
        await database.query(sql, (err, result) => {
            if (err) {
                return next(new errs.BadGatewayError(err));
            }
            if (result.length === 0) {
                return resolve(false);
            } else {
                return resolve(true);
            }
        });
    })
}