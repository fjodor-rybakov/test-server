import * as jwt from "jsonwebtoken";
import config from "../config";
import * as errs from "restify-errors";
import Utils from "./Utils";

export function authorization(req, res, next) {
    const token = req.headers["x-guide-key"];
    if (!Utils.isset(token)) {
        return next(new errs.InvalidArgumentError("Token not found"));
    }
    try {
        return jwt.verify(token, config.jwt.secret);
    } catch (e) {
        console.log("token expired");
        return next(new errs.GoneError("token expired"));
    }
}