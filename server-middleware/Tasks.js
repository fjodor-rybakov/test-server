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
            })
            .catch(() => {
                res.send("err");
            });
    }

    static tracks(database, req, res, next) {
        authorization(req, res, next);
        const taskId = req.params.taskId;
        getTracks(database, next, taskId)
            .then((data) => {
                res.send(data);
            })
            .catch(() => {
                res.send("err");
            });
    }

    static addTrack(database, req, res, next) {
        const data = JSON.parse(req.body);
        addTrack(database, next, data)
            .then((data) => {
                res.send(data);
            })
            .catch(() => {
                res.send("err");
            });
    }
}