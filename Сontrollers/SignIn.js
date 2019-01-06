import Utils from "../Utils/Utils";
import {checkUser} from "../Services/checkUser";
import * as errs from "restify-errors";
import config from "../config";
import * as jwt from "jsonwebtoken";

export class SignIn {
    static signIn(database, req, res, next) {
        const data = req.body;
        if (!Utils.isset(data.email, data.password)) {
            return next(new errs.InvalidArgumentError("Not enough body data"));
        }
        checkUser(database, data, next)
            .then((dataUser) => {
                const newDataUser = {
                    id_user: dataUser[0].id_user,
                    id_role: dataUser[0].id_role
                };
                let token = jwt.sign(newDataUser, config.jwt.secret, {
                    expiresIn: config.leaveTimeToken
                });
                console.log(jwt.decode(token));
                let {exp} = jwt.decode(token);
                res.send({exp, token})
            });
    }
}