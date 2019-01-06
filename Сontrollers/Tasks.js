import {getTasksList} from "../Services/getTasksList";
import {getTracks, addTrack} from "../Services/Tracks";
import {authorization} from "../Utils/authorization";
import Utils from "../Utils/Utils";
import * as errs from "restify-errors";

export class Tasks {
    static async tasksList(database, req, res, next) {
        await authorization(req, res, next);
        const projectId = req.params.projectId;
        getTasksList(database, next, projectId)
            .then((data) => {
                res.send(data);
            });
    }

    static async getTracks(database, req, res, next) {
        const dataUser = await authorization(req, res, next);
        const id_user = dataUser.id_user;
        const taskId = req.params.taskId;
        await getTracks(database, next, taskId)
            .then((data) => {
                const newData = {
                    id_user: id_user,
                    tracks: data
                };
                res.send(newData);
            });
    }

    static async addTrack(database, req, res, next) {
        await authorization(req, res, next);
        const data = req.body;
        if (!Utils.isset(data.start_time, data.end_time, data.id_task)) {
            return next(new errs.InvalidArgumentError("Not enough body data"));
        }
        addTrack(database, next, data)
            .then((data) => {
                res.send(data);
            });
    }
}