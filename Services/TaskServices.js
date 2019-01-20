import * as errors from "restify-errors";
import Utils from "../Utils/Utils";
import * as fse from "fs-extra";

export class TaskServices {
    async getTaskById(database, id) {
        let sql = `SELECT * FROM task 
                   LEFT JOIN media ON media.id_task = task.id_task
                   WHERE task.id_task = ?`;
        let options = [id];
        let result = await database.query(sql, options)
            .catch((error) => {
                throw new errors.BadGatewayError(error.message);
            });

        if (result.length === 0) {
            throw new errors.NotFoundError("Task not found");
        }

        return result[0];
    }

    async getTasksList(database, projectId) {
        let sql = `SELECT * FROM task WHERE id_project = ?`;
        let options = [projectId];

        return await database.query(sql, options)
            .catch((error) => {
                throw new errors.BadGatewayError(error.message);
            });
    }

    async createTask(database, data) {
        let sql = `INSERT INTO task VALUES (null, ?, ?, ?, ?, ?, 'open')`;
        let options = [data.id_project, data.id_user_manager, data.description, data.time, data.title];
        let result = await database.query(sql, options)
            .catch((error) => {
                throw new errors.BadGatewayError(error.message);
            });

        return result.insertId;
    }

    async addTaskTeam(database, developers, id) {
        for (let i = 0; i < developers.length; i++) {
            let sql = `INSERT INTO task_and_user VALUES (null, ?, ?)`;
            let options = [id, developers[i].id_user];
            await database.query(sql, options)
                .catch((error) => {
                    throw new errors.BadGatewayError(error.message);
                });
        }
    }

    async updateTask(database, taskId, data) {
        const {id_project, id_user_manager, description, time, title, status} = data;

        if (Utils.isset(time) && !Utils.isNumeric(time)) {
            throw new errors.InvalidArgumentError("Incorrect time");
        }

        let sql = `UPDATE task SET 
                      id_project = ?,
                      id_user_manager = ?,
                      description = ?,
                      time = ?,
                      title = ?,
                      status = ?
               WHERE id_task = ?`;
        const options = [id_project, id_user_manager, description, time, title, status, taskId];
        return await database.query(sql, options)
            .catch((error) => {
                throw new errors.BadGatewayError(error.message);
            });
    }

    async deleteTask(database, taskId) {
        let sql = `DELETE FROM track WHERE id_task = ?`;
        let options = [taskId];
        await database.query(sql, options)
            .catch((error) => {
                throw new errors.BadGatewayError(error.message);
            });

        sql = `DELETE FROM task_and_user WHERE id_task = ?`;
        await database.query(sql, options)
            .catch((error) => {
                throw new errors.BadGatewayError(error.message);
            });

        sql = `DELETE FROM task WHERE id_task = ?`;
        return await database.query(sql, options)
            .catch((error) => {
                throw new errors.BadGatewayError(error.message);
            });
    }

    async addFile(database, path, typeIMG, id_task) {
        let sql = `INSERT INTO media VALUES (null, ?, ?, null, ?)`;
        const options = [id_task, typeIMG, path];

        return await database.query(sql, options)
            .catch((error) => {
                throw new errors.BadGatewayError(error.message);
            });
    }

    async updateFile(database, path, typeIMG, id_task) {
        let sql = `UPDATE media SET 
                   media_type = ?,
                   path = ?
                   WHERE media.id_task = ?`;
        const options = [typeIMG, path, id_task];

        return await database.query(sql, options)
            .catch((error) => {
                throw new errors.BadGatewayError(error.message);
            });
    }

    async deleteFileTask(database, taskId) {
        let sql = `SELECT media.path FROM media WHERE id_task = ?`;
        let options = [taskId];

        const path = await database.query(sql, options)
            .catch((error) => {
                throw new errors.BadGatewayError(error.message);
            });

        await fse.unlinkSync(path);

        sql = `DELETE FROM media WHERE id_task = ?`;
        options = [taskId];

        return await database.query(sql, options)
            .catch((error) => {
                throw new errors.BadGatewayError(error.message);
            });
    }

    async deleteFile(database) {
        let sql = ``;
        const options = [];

        return await database.query(sql, options)
            .catch((error) => {
                throw new errors.BadGatewayError(error.message);
            });
    }

    async getCountAllFiles(database) {
        let sql = `SELECT MAX(media.id_media) as insert_pos FROM media`;

        const result =  await database.query(sql)
            .catch((error) => {
                throw new errors.BadGatewayError(error.message);
            });

        const insert_pos = result[0].insert_pos;

        return insert_pos === null ? 0 : insert_pos;
    }
}