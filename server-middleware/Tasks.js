import {getTasksList} from "../request-database/getTasksList";
import {getTracks, addTrack} from "../request-database/Tracks";
import {authorization} from "../utils/authorization";

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
                data.id_user = id_user;
                res.send(data);
            });
    }

    static async addTrack(database, req, res, next) {
        await authorization(req, res, next);
        const data = req.body;
        addTrack(database, next, data)
            .then((data) => {
                res.send(data);
            });
    }
}