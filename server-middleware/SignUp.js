import Utils from "../utils/Utils";
import {addUser} from "../request-database/addUser";
import * as errs from "restify-errors";

export class SignUp {
    static singUp(database, req, res, next) {
        const data = req.body;
        if (!Utils.isset(data.email, data.password)) {
            return next(new errs.InvalidArgumentError("Not enough body data"));
        }
        addUser(database, data, next)
            .then(() => {
                res.send("success");
            })
            .catch(() => {
                res.send("email is already exist");
            });
    }
}