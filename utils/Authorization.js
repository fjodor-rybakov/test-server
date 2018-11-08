import * as jwt from "jsonwebtoken";
import config from "../config";
import * as errs from "restify-errors";
import Utils from "./Utils";

export function Authorization(req, res, next) {
    let data = JSON.parse(req.body);
    if (!Utils.isset(data.token)) {
        return next(new errs.InvalidArgumentError("Not enough body data"));
    }
    console.log(data);
    try {
        res.send(jwt.verify(data.token, config.jwt.secret));
    } catch (e) {
        console.log("token expired");
        return next(new errs.GoneError("token expired"));
    }
}