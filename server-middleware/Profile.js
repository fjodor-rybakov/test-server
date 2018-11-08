import Utils from "../utils/Utils";
import {updateProfile} from "../request-database/updateProfile";
import * as errs from "restify-errors";
import {getProfile} from "../request-database/getProfile";
import * as jwt from "jsonwebtoken";
import config from "../config";

export class Profile {
    static postProfileData(database, req, res, next) {
        const data = JSON.parse(req.body);
        if (!Utils.isset(data.token)) {
            return next(new errs.InvalidArgumentError("Not enough body data"));
        }
        let dataUser;
        try {
            dataUser = jwt.verify(data.token, config.jwt.secret);
        } catch (e) {
            return next(new errs.GoneError("token expired"));
        }
        const id_user = dataUser.id_user;
        getProfile(database, id_user, next)
            .then((data) => {
                res.send(data[0]);
            })
            .catch(() => {
                res.send("err");
            });
    }

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