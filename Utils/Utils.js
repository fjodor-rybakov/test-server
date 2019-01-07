import config from "../config";
import * as errs from "restify-errors";
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

    static checkPassword(password, originData) {
        return new Promise(resolve => {
            if (password !== config.crypt.decrypt(originData[0].password)) {
                throw new errs.BadRequestError("Incorrect password");
            }
            return resolve(originData);
        });
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
            throw new errs.InvalidArgumentError("Token not found");
        }
        try {
            return jwt.verify(token, config.jwt.secret);
        } catch (e) {
            console.log("token expired");
            throw new errs.GoneError("token expired");
        }
    }
}