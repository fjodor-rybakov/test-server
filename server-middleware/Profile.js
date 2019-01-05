import {updateProfile} from "../request-database/updateProfile";
import * as errs from "restify-errors";
import {getProfile, getRole, getRoles} from "../request-database/getProfile";
import fs from "fs";
import {authorization} from "../utils/authorization";

export class Profile {
    static async getProfileData(database, req, res, next) {
        const dataUser = await authorization(req, res, next);
        const id_user = dataUser.id_user;
        getProfile(database, id_user, next)
            .then((data) => {
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
            });
    }

    static async getInfo(database, req, res, next) {
        const dataUser = await authorization(req, res, next);
        const id_role = dataUser.id_role;
        getRole(database, id_role, next)
            .then((data) => {
                const result = {
                    role: data[0].name,
                    id_user: dataUser.id_user
                };
                res.send(result)
            });
    }

    static async getRoles(database, req, res, next) {
        getRoles(database, next)
            .then((data) => {
                res.send(data)
            });
    }

    static async updateProfile(database, req, res, next) {
        await authorization(req, res, next);
        const data = req.body;
        const base64Data = data.photo.replace(/^data:image\/png;base64,/, "");
        let path = "resources/photo_" + data.id_user + ".png";
        if (data.photo !== "") {
            await fs.writeFile(path, base64Data, "base64", (err) => {
                console.log(err);
            });
        }

        await Profile.checkPhoto(path)
            .then((data) => {
                return path = data;
            });

        updateProfile(database, data, path, next)
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