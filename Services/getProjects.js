import * as errs from "restify-errors";

export function getProjects(database, dataUser, next) {
    return new Promise(async (resolve) => {
        let id = dataUser.id_user;
        let sql = `SELECT project.id_project, description, id_project_type, id_user_client, status, title, is_private, id_project_manager 
                   FROM project
                   LEFT JOIN project_and_user 
                   ON project_and_user.id_project = project.id_project
                   WHERE id_user = ${id} OR project.id_project_manager = ${id} OR 
                   project.id_user_client = ${id} OR project.is_private = false
                   GROUP BY project.id_project`;
        database.query(sql, (err, result) => {
            if (err) {
                return next(new errs.BadGatewayError(err));
            }
            return resolve(result);
        })
    })
}