import config from "../config";
import * as errs from "restify-errors";

export default class Utils {
    static isset() {
        let i = 0;
        if (arguments.length === 0) {
            console.log("Empty isset");
        }

        while (i !== arguments.length) {
            if (typeof arguments[i] === "string" && arguments[i].trim() === "") {
                return false;
            }
            if (typeof(arguments[i]) === "undefined" || arguments[i] === null) {
                return false;
            } else {
                i++;
            }
        }
        return true;
    }

    static checkPassword(password, originData, next) {
        try {
            if (password === config.crypt.decrypt(originData[0].password)) {
                return originData;
            } else {
                return next(new errs.BadRequestError("Incorrect password"))
            }
        } catch (e) {
            return next(new errs.BadRequestError("Incorrect password"))
        }
    }
}