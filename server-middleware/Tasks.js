import {getTasksList} from "../request-database/getTasksList";
import {getTracks, addTrack} from "../request-database/Tracks";
import {authorization} from "../utils/authorization";

export class Tasks {
    static tasksList(database, req, res, next) {
        authorization(req, res, next);
        const projectId = req.params.projectId;
        getTasksList(database, next, projectId)
            .then((data) => {
                res.send(data);
            });
    }

    static getTracks(database, req, res, next) {
        const dataUser = authorization(req, res, next);
        const id_user = dataUser.id_user;
        const taskId = req.params.taskId;
        getTracks(database, next, taskId)
            .then((data) => {
                data.id_user = id_user;
                res.send(data);
            });
    }

    static addTrack(database, req, res, next) {
        authorization(req, res, next);
        const data = req.body;
        addTrack(database, next, data)
            .then((data) => {
                res.send(data);
            });
    }
}