import * as errors from "restify-errors";

export class PermissionServices {
    async getCreateProjectPermission(database, id_role) {
        let sql = `SELECT name FROM role WHERE id_role = ?`;
        let options = [id_role];

        let result = await database.query(sql, options)
            .catch((error) => {
                throw new errors.BadGatewayError(error.message)
            });

        if (result.length === 0) {
            throw new errors.NotFoundError("Role not found");
        }

        return (result[0].name === "project manager" || result[0].name === "client");
    }

    async getCreateTrackPermission(database, idUser, taskId) {
        let sql = `SELECT * FROM task
               LEFT JOIN task_and_user ON task_and_user.id_task = task.id_task
               WHERE (id_user = ? OR task.id_user_manager = ?) AND task.id_task = ?`;
        let options = [idUser, idUser, taskId];

        let result = await database.query(sql, options)
            .catch((error) => {
                throw new errors.BadGatewayError(error.message)
            });

        return result !== 0;
    }

    async getCreateTaskPermission(database, idUser, idProject) {
        let sql = `SELECT * FROM project WHERE id_project_manager = ${idUser} AND id_project = ${idProject}`;
        let options = [idUser, idProject];

        let result = await database.query(sql, options)
            .catch((error) => {
                throw new errors.BadGatewayError(error.message)
            });

        return result !== 0;
    }
}