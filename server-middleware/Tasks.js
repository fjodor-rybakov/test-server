import {getTasksList} from "../request-database/getTasksList";
import {getTracks, addTrack} from "../request-database/Tracks";
import Utils from "../utils/Utils";
import * as errs from "restify-errors";
import * as jwt from "jsonwebtoken";
import config from "../config";


export class Tasks {
    static tasksList(database, req, res, next) {
        const token = req.headers["x-guide-key"];
        if (!Utils.isset(token)) {
            return next(new errs.InvalidArgumentError("Not enough body data"));
        }
        try {
            jwt.verify(token, config.jwt.secret);
        } catch (e) {
            return next(new errs.GoneError("token expired"));
        }
        const data = req.body;
        getTasksList(database, next, data)
            .then((data) => {
                res.send(data);
            })
            .catch(() => {
                res.send("err");
            });
    }

    static tracks(database, req, res, next) {
        const token = req.headers["x-guide-key"];
        if (!Utils.isset(token)) {
            return next(new errs.InvalidArgumentError("Not enough body data"));
        }
        try {
            jwt.verify(token, config.jwt.secret);
        } catch (e) {
            return next(new errs.GoneError("token expired"));
        }
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