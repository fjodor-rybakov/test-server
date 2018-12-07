import {getProjects} from "../request-database/getProjects";
import Utils from "../utils/Utils";
import * as errs from "restify-errors";
import * as jwt from "jsonwebtoken";
import config from "../config";

export class ProjectList {
    static getProjectList(database, req, res, next) {
        const token = req.headers["x-guide-key"];
        console.log(token);
        if (!Utils.isset(token)) {
            return next(new errs.InvalidArgumentError("Not enough body data"));
        }
        try {
            jwt.verify(token, config.jwt.secret);
        } catch (e) {
            return next(new errs.GoneError("token expired"));
        }
        getProjects(database, next)
            .then((data) => {
                res.send(data);
            })
            .catch(() => {
                res.send("err");
            });
    }
}