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
                fs.readFile(data[0].photo, {encoding: "base64"}, async (err, result) => {
                    if (err) {
                        return next(new errs.InternalServerError("Read photo error"));
                    }
                    const newData = data[0];
                    newData.photo = "data:image/png;base64," + result;
                    res.send(newData);
                });
            })
            .catch(() => {
                res.send("err");
            });
    }

    static postUpdateProfile(database, req, res, next) {
        const data = JSON.parse(req.body);
        if (!Utils.isset(data)) {
            return next(new errs.InvalidArgumentError("Not enough body data"));
        }

        const base64Data = data.photo.replace(/^data:image\/png;base64,/, "");
        const path = "resources/photo_" + data.id_user + ".png";
        fs.writeFile(path, base64Data, 'base64', function(err) {
            console.log(err);
        });

        updateProfile(database, data, path)
            .then(() => {
                res.send("success");
            })
            .catch(() => {
                return next(new errs.InvalidArgumentError("Request database error"));
            });
    }
}