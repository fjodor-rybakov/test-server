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

    static checkPassword(password, originData) {
        return new Promise(resolve => {
            if (password === config.crypt.decrypt(originData[0].password)) {
                return resolve(originData);
            } else {
                throw new errs.BadRequestError("Incorrect password")
            }
        });
    }
}