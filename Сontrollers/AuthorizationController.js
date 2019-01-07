import Utils from "../Utils/Utils";
import * as errors from "restify-errors";
import * as jwt from "jsonwebtoken";
import config from "../config";
import {AuthorizationServices} from "../Services/AuthorizationServices";

const services = new AuthorizationServices();

export class AuthorizationController {
    static signIn(database, req, res, next) {
        const data = req.body;
        if (!Utils.isset(data.email, data.password)) {
            return next(new errors.InvalidArgumentError("Not enough body data"));
        }
        services.checkUser(database, data, next)
            .then((dataUser) => {
                const newDataUser = {
                    id_user: dataUser[0].id_user,
                    id_role: dataUser[0].id_role
                };
                let token = jwt.sign(newDataUser, config.jwt.secret, {
                    expiresIn: config.leaveTimeToken
                });
                let {exp} = jwt.decode(token);
                res.send({exp, token})
            })
            .catch((error) => {
                return next(error);
            });
    }

    static singUp(database, req, res, next) {
        const data = req.body;
        if (!Utils.isset(data.email, data.password, data.role)) {
            return next(new errors.InvalidArgumentError("Not enough body data"));
        }
        services.createUser(database, data, next)
            .then(() => {
                res.send("Success create new user");
            })
            .catch((error) => {
                return next(error);
            });
    }
}