import {TaskServices} from "../Services";
import Utils from "../Utils/Utils";
import * as errors from "restify-errors";
import * as fse from "fs-extra";

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
                .then(async (result) => {
                    if (result.photo === "") {
                        res.send(result);
                    }

                    await Utils.getPhotoBase64(result.path, result.media_type)
                        .then((photoData) => {
                            result.photo = photoData;
                            console.log(result);
                            res.send(result);
                        })
                        .catch((error) => {
                            return next(new errors.BadGatewayError(error.message));
                        });
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
            const {id_project, id_user_manager, description, time, title, developers, photo} = data;
            if (!Utils.isset(id_project, id_user_manager, description, time, title, developers)) {
                throw new errors.InvalidArgumentError("Not enough body data");
            }

            if (!Utils.isNumeric(time)) {
                throw new errors.InvalidArgumentError("Incorrect time");
            }

            await services.createTask(database, data)
                .then(async (id) => {
                    await services.addTaskTeam(database, data.developers, id);
                    return id;
                })
                .then(async (id_task) => {
                    if (Utils.isset(photo)) {
                        const {typeIMG} = data;
                        const dataImgIndex = photo.indexOf(",");
                        const base64Data = photo.substring(dataImgIndex + 1);
                        let path = "Resources/media/photo/photo_" + id_task + `.${typeIMG}`;

                        if (photo !== "") {
                            await fse.writeFile(path, base64Data, "base64")
                                .catch(() => {
                                    return next(new errors.BadGatewayError("Error write file"));
                                });
                        }

                        await services.addFile(database, path, typeIMG, id_task);
                    }

                    return id_task;
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
            const {photo} = data;

            if (Utils.isset(photo)) {
                const {typeIMG} = data;
                const dataImgIndex = photo.indexOf(",");
                const base64Data = photo.substring(dataImgIndex + 1);
                let path = "Resources/media/photo/photo_" + taskId + `.${typeIMG}`;

                if (photo !== "") {
                    await fse.writeFile(path, base64Data, "base64")
                        .catch(() => {
                            return next(new errors.BadGatewayError("Error write file"));
                        });
                }


            }

            await services.updateTask(database, taskId, data)
                .then(() => {
                    res.send("Success update task");
                });
        } catch (error) {
            return next(error);
        }
    }

    static async deleteFileTask(database, req, res, next) {
        try {
            await Utils.authorization(req);
            const taskId = req.params.taskId;
            if (!Utils.isset(taskId) && !Utils.isNumeric(taskId)) {
                throw new errors.InvalidArgumentError("Incorrect params id");
            }

            await services.deleteFileTask(database, taskId)
                .then(() => {
                    res.send("Success delete file from task");
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
            const data = req.body;
            const {typeIMG, photo} = data;
            const dataImgIndex = photo.indexOf(",");
            const base64Data = photo.substring(dataImgIndex + 1);
            let path = "Resources/media/photo/photo_" + data.id_user + `.${typeIMG}`;

            if (data.photo !== "") {
                await fse.writeFile(path, base64Data, "base64")
                    .catch(() => {
                        return next(new errors.BadGatewayError("Error write file"));
                    });
            }

            await services.addFile(database)
                .then(() => {
                    res.send("Success add file to task");
                })
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