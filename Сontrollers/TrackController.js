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
            if (!Utils.isset(taskId)) {
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
            if (!Utils.isset(data.start_time, data.end_time, data.id_task)) {
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
}
