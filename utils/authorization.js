import * as jwt from "jsonwebtoken";
import config from "../config";
import * as errs from "restify-errors";
import Utils from "./Utils";

export function authorization(req, res, next) {
    const token = req.headers["x-guide-key"];
    console.log("+++++++++++++++", token);
    if (!Utils.isset(token)) {
        next(new errs.InvalidArgumentError("Token not found"));
    }
    try {
        const data = jwt.verify(token, config.jwt.secret);
        return data;
    } catch (e) {
        console.log("token expired");
        next(new errs.GoneError("token expired"));
    }
}