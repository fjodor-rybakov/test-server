import Utils from "../Utils/Utils";
import * as errors from "restify-errors";
import {TrackServices} from "../Services";

const services = new TrackServices();

export class TrackController {
    static async getTracks(database, req, res, next) {
        try {
            let dataUser = await Utils.authorization(req);
            const id_user = dataUser.id_user;
            const taskId = req.params.taskId;
            if (!Utils.isset(taskId) && !Utils.isNumeric(taskId)) {
                throw new errors.InvalidArgumentError("Incorrect params id");
            }

            await services.getTracks(database, taskId)
                .then((result) => {
                    const newData = {
                        id_user: id_user,
                        tracks: result
                    };
                    res.send(newData);
                });
        } catch (error) {
            return next(error);
        }
    }

    static async addTrack(database, req, res, next) {
        try {
            await Utils.authorization(req);
            const data = req.body;
            const {start_time, end_time, id_task} = data;
            if (!Utils.isset(start_time, end_time, id_task) && !Utils.isNumeric(id_task)) {
                return next(new errors.InvalidArgumentError("Not enough body data"));
            }

            await services.addTrack(database, data)
                .then((result) => {
                    res.send(result);
                });
        } catch (error) {
            return next(error);
        }
    }

    static async updateTrack(database, req, res, next) {
        try {
            await Utils.authorization(req);
            const data = req.body;
            const taskId = req.params.taskId;
            if (!Utils.isset(taskId) && !Utils.isNumeric(taskId)) {
                throw new errors.InvalidArgumentError("Incorrect params id");
            }

            await services.updateTrack(database, data, taskId)
                .then(() => {
                    res.send("Track success update");
                });
        } catch (error) {
            return next(error);
        }
    }

    static async deleteTrack(database, req, res, next) {
        try {
            await Utils.authorization(req);
            const taskId = req.params.taskId;
            if (!Utils.isset(taskId)) {
                throw new errors.InvalidArgumentError("Incorrect params id");
            }

            await services.deleteTrack(database, taskId)
                .then(() => {
                    res.send("Track success delete");
                });
        } catch (error) {
            return next(error);
        }
    }
}
