import Utils from "../Utils/Utils";
import {PermissionServices} from "../Services";
import * as errors from "restify-errors";

const services = new PermissionServices();

export class PermissionController {
    static async CreateProjectPermission(database, req, res, next) {
        try {
            const dataUser = await Utils.authorization(req);
            await services.getCreateProjectPermission(database, dataUser.id_role)
                .then((result) => {
                    res.send(result);
                });
        } catch (error) {
            return next(error);
        }
    }

    static async CreateTrackPermission(database, req, res, next) {
        try {
            const dataUser = await Utils.authorization(req);
            const taskId = req.params.taskId;
            if (!Utils.isset(taskId)) {
                throw new errors.InvalidArgumentError("Incorrect params id");
            }

            await services.getCreateTrackPermission(database, dataUser.id_user, taskId)
                .then((result) => {
                    res.send(result);
                });
        } catch (error) {
            return next(error);
        }
    }

    static async CreateTaskPermission(database, req, res, next) {
        try {
            const dataUser = await Utils.authorization(req);
            const projectId = req.params.projectId;
            if (!Utils.isset(projectId)) {
                throw new errors.InvalidArgumentError("Incorrect params id");
            }

            await services.getCreateTaskPermission(database, dataUser.id_user, projectId)
                .then((data) => {
                    res.send({value: data});
                });
        } catch (error) {
            return next(error);
        }
    }
}