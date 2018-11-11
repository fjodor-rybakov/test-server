import Utils from "../utils/Utils";
import {updateProfile} from "../request-database/updateProfile";
import * as errs from "restify-errors";
import {getProfile} from "../request-database/getProfile";
import * as jwt from "jsonwebtoken";
import config from "../config";
import fs from "fs";

export class Profile {
    static postProfileData(database, req, res, next) {
        const data = JSON.parse(req.body);
        if (!Utils.isset(data.token)) {
            return next(new errs.InvalidArgumentError("Not enough body data"));
        }
        let dataUser;
        try {
            dataUser = jwt.verify(data.token, config.jwt.secret);
        } catch (e) {
            return next(new errs.GoneError("token expired"));
        }
        const id_user = dataUser.id_user;
        getProfile(database, id_user, next)
            .then((data) => {
                console.log(data[0]);
                if (data[0].photo === "") {
                    res.send(data[0]);
                }

                Profile.checkPhoto(data[0].photo)
                    .then((path) => {
                        fs.readFile(path, {encoding: "base64"}, (err, result) => {
                            const newData = data[0];
                            newData.photo = "data:image/png;base64," + result;
                            res.send(newData);
                        });
                    });
            })
            .catch(() => {
                res.send("err");
            });
    }

    static async postUpdateProfile(database, req, res, next) {
        const data = JSON.parse(req.body);
        if (!Utils.isset(data)) {
            return next(new errs.InvalidArgumentError("Not enough body data"));
        }

        const base64Data = data.photo.replace(/^data:image\/png;base64,/, "");
        let path = "resources/photo_" + data.id_user + ".png";
        if (data.photo !== "") {
            await fs.writeFile(path, base64Data, 'base64', function (err) {
                console.log(err);
            });
        }

        await Profile.checkPhoto(path)
            .then((data) => {
                return path = data;
            });

        updateProfile(database, data, path)
            .then(() => {
                res.send("success");
            })
            .catch(() => {
                return next(new errs.InvalidArgumentError("Request database error"));
            });
    }

    static checkPhoto(path) {
        return new Promise((resolve) => {
            fs.readFile(path, {encoding: "base64"}, (err) => {
                if (err) {
                    return resolve("resources/default-avatar.png");
                }
                return resolve(path);
            });
        });
    }
}