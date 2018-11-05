import Utils from "../utils/Utils";
import {updateProfile} from "../request-database/updateProfile";
import * as errs from "restify-errors";

export class Profile {
    static postUpdateProfile(database, req, res, next) {
        const data = JSON.parse(req.body);
        if (!Utils.isset(data)) {
            return next(new errs.InvalidArgumentError("Not enough body data"));
        }
        updateProfile(database, data)
            .then(() => {
                res.send("success");
            })
            .catch(() => {
                return next(new errs.InvalidArgumentError("Request database error"));
            });
    }
}