import {getTasksList} from "../request-database/getTasksList";
import {getTracks, addTrack} from "../request-database/Tracks";


export class Tasks {
    static getTasksList(database, req, res, next) {
        const data = JSON.parse(req.body);
        getTasksList(database, next, data)
            .then((data) => {
                res.send(data);
            })
            .catch(() => {
                res.send("err");
            });
    }

    static getTracks(database, req, res, next) {
        const data = JSON.parse(req.body);
        getTracks(database, next, data)
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