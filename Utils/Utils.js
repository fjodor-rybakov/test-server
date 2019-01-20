import config from "../config";
import * as errors from "restify-errors";
import * as fse from "fs-extra";
import * as jwt from "jsonwebtoken";

const checkEmail = `(?:[a-z0-9!#$%&'*+/=?^_\`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_\`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\\])`;

export default class Utils {
    static isEmail(email) {
        return email.match(checkEmail);
    }

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

    static async getPhotoBase64(path, typeFile) {
        return await fse.readFile(path, {encoding: "base64"})
            .then((photoData) => {
                return `data:image/${typeFile};base64,` + photoData;
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