import Utils from "../Utils/Utils";
import * as errors from "restify-errors";
import * as jwt from "jsonwebtoken";
import config from "../config";
import {AuthorizationServices} from "../Services/AuthorizationServices";

const services = new AuthorizationServices();

export class AuthorizationController {
    static async signIn(database, req, res, next) {
        const {email, password} = req.body;
        if (!Utils.isset(email, password)) {
            return next(new errors.InvalidArgumentError("Not enough body data"));
        }

        if (!email.match(`(?:[a-z0-9!#$%&'*+/=?^_\`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_\`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\\])`)) {
            return next(new errors.InvalidArgumentError("Incorrect email address"));
        }

        await services.checkUser(database, email, password, next)
            .then((dataUser) => {
                const newDataUser = {
                    id_user: dataUser.id_user,
                    id_role: dataUser.id_role
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

    static async singUp(database, req, res, next) {
        const data = req.body;
        const {email, password, role} = data;
        if (!Utils.isset(email, password, role)) {
            return next(new errors.InvalidArgumentError("Not enough body data"));
        }

        if (!email.match(`(?:[a-z0-9!#$%&'*+/=?^_\`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_\`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\\])`)) {
            return next(new errors.InvalidArgumentError("Incorrect email address"));
        }

        await services.createUser(database, data, next)
            .then(() => {
                res.send("Success create new user");
            })
            .catch((error) => {
                return next(error);
            });
    }
}