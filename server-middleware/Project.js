import {addTaskTeam, createTaskImpl, getProject, getUserListByRole} from "../request-database/getProject";
import Utils from "../utils/Utils";
import * as errs from "restify-errors";
import * as jwt from "jsonwebtoken";
import config from "../config";

export class Project {
    static project(database, req, res, next) {
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
        getProject(database, data, next)
            .then((data) => {
                res.send(data);
            })
            .catch(() => {
                res.send("err");
            });
    }

    static postUserListByRole(database, req, res, next) {
        const data = JSON.parse(req.body);
        getUserListByRole(database, next, data.role)
            .then((data) => {
                res.send(data);
            })
            .catch(() => {
                res.send("err");
            });
    }

    static async createTask(database, req, res, next) {
        const data = JSON.parse(req.body);
        await createTaskImpl(database, next, data.data)
            .then((result) => {
                addTaskTeam(database, next, data.data.developers, result[0].id)
                    .then((data) => {
                        res.send( {success: true, data: data} );
                    })
                    .catch((err) => {
                        res.send( {success: false, data: err} );
                    });
            })
            .catch((err) => {
                res.send( {success: false, data: err} );
            });
    }
}