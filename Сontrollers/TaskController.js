import {TaskServices} from "../Services";
import Utils from "../Utils/Utils";
import * as errors from "restify-errors";

const services = new TaskServices();

export class TaskController {
    static async getTask(database, req, res, next) {
        try {
            await Utils.authorization(req);
            const taskId = req.params.taskId;
            if (!Utils.isset(taskId) && !Utils.isNumeric(taskId)) {
                throw new errors.InvalidArgumentError("Incorrect params id");
            }

            await services.getTaskById(database, taskId)
                .then((result) => {
                    res.send(result);
                });
        } catch (error) {
            return next(error);
        }
    }

    static async tasks(database, req, res, next) {
        try {
            await Utils.authorization(req);
            const projectId = req.params.projectId;
            if (!Utils.isset(projectId) && !Utils.isNumeric(projectId)) {
                throw new errors.InvalidArgumentError("Incorrect params id");
            }

            await services.getTasksList(database, projectId)
                .then((result) => {
                    res.send(result);
                });
        } catch (error) {
            return next(error);
        }
    }

    static async createTask(database, req, res, next) {
        try {
            await Utils.authorization(req);
            const data = req.body;
            const {id_project, id_user_manager, description, time, title, developers} = data;
            if (!Utils.isset(id_project, id_user_manager, description, time, title, developers)) {
                throw new errors.InvalidArgumentError("Not enough body data");
            }

            if (!Utils.isNumeric(time)) {
                throw new errors.InvalidArgumentError("Incorrect time");
            }

            await services.createTask(database, data)
                .then((id) => {
                    return services.addTaskTeam(database, data.developers, id);
                })
                .then(() => {
                    res.send("Success create task");
                });
        } catch (error) {
            return next(error);
        }
    }

    static async updateTask(database, req, res, next) {
        try {
            await Utils.authorization(req);
            const taskId = req.params.taskId;
            if (!Utils.isset(taskId) && !Utils.isNumeric(taskId)) {
                throw new errors.InvalidArgumentError("Incorrect params id");
            }
            const data = req.body;

            await services.updateTask(database, taskId, data)
                .then(() => {
                    res.send("Success update task");
                });
        } catch (error) {
            return next(error);
        }
    }

    static async deleteTask(database, req, res, next) {
        try {
            await Utils.authorization(req);
            const taskId = req.params.taskId;
            if (!Utils.isset(taskId) && !Utils.isNumeric(taskId)) {
                throw new errors.InvalidArgumentError("Incorrect params id");
            }

            await services.deleteTask(database, taskId)
                .then(() => {
                    res.send("Success delete task");
                });
        } catch (error) {
            return next(error);
        }
    }

    static async addFile(database, req, res, next) {
        try {
            await Utils.authorization(req);
            const taskId = req.params.taskId;
            const file = req;

            // console.log(req);
            console.log(req.file);
            console.log(req.files);
            console.log(req.body);


            res.send("Ok");
            // await services.addFile()
        } catch (error) {
            return next(error);
        }
    }

    static async getAllFiles(database, req, res, next) {
        try {
            await Utils.authorization(req);

        } catch (error) {
            return next(error);
        }
    }

    static async updateFile(database, req, res, next) {
        try {
            await Utils.authorization(req);

        } catch (error) {
            return next(error);
        }
    }

    static async deleteFile(database, req, res, next) {
        try {
            await Utils.authorization(req);

        } catch (error) {
            return next(error);
        }
    }
}