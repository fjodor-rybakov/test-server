import Utils from "../utils/Utils";
import {getProfile} from "../request-database/getProfile";
import * as errs from "restify-errors";
import config from "../config";
import * as jwt from "jsonwebtoken";

export class Authorization {
    static postAuthorization(database, req, res, next) {
        const data = JSON.parse(req.body);
        if (!Utils.isset(data.token)) {
            return next(new errs.InvalidArgumentError("Not enough body data"));
        }
        console.log(data);
        try {
            const dataUser = jwt.verify(data.token, config.jwt.secret);
            const id_user = dataUser.id_user;
            console.log(dataUser);
            getProfile(database, id_user, next)
                .then((data) => {
                    res.send(data[0]);
                })
                .catch(() => {
                    res.send("err");
                });
        } catch (e) {
            console.log(e);
            return next(new errs.UnauthorizedError("token expired"));
        }
    }
}