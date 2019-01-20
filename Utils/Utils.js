import config from "../config";
import * as errors from "restify-errors";
import * as fse from "fs-extra";
import * as jwt from "jsonwebtoken";

export default class Utils {
    static isset() {
        for (const value of arguments) {
            if (value == null || value.length === 0) {
                return false;
            }
        }
        return true;
    }

    static checkPassword(password, originPassword) {
        const userPassword = config.crypt.decrypt(originPassword);
        if (password !== userPassword) {
            throw new errors.BadRequestError("Password does not match");
        }
    }

    static async restorePathPhoto(path) {
        return await fse.readFile(path, {encoding: "base64"})
            .then(() => {
                return path;
            })
            .catch(() => {
                return "Resources/default-avatar.png";
            });
    }

    static async getPhotoBase64(path) {
        return await fse.readFile(path, {encoding: "base64"})
            .then((photoData) => {
                return "data:image/png;base64," + photoData;
            });
    }

    static authorization(req) {
        const token = req.headers["x-guide-key"];
        if (!Utils.isset(token)) {
            throw new errors.InvalidArgumentError("Token not found");
        }
        try {
            return jwt.verify(token, config.jwt.secret);
        } catch (e) {
            console.log("token expired");
            throw new errors.GoneError("token expired");
        }
    }

    static isNumeric(number) {
        return !isNaN(parseFloat(number)) && isFinite(number);
    }
}