import config from "../config";
import * as errs from "restify-errors";

export default class Utils {
    static isset() {
        for (const value of arguments) {
            if (value == null || value.length === 0) {
                return false;
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