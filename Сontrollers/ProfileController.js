import * as fse from "fs-extra";
import {ProfileServices} from "../Services";
import * as errors from "restify-errors";
import Utils from "../Utils/Utils";

const services = new ProfileServices();

export class ProfileController {
    static async getProfileData(database, req, res, next) {
        try {
            const dataUser = await Utils.authorization(req);
            const id_user = dataUser.id_user;

            if (!Utils.isset(id_user) && !Utils.isNumeric(id_user)) {
                throw new errors.InvalidArgumentError("Incorrect user id");
            }

            await services.getProfile(database, id_user)
                .then((result) => {
                    if (result.photo === "") {
                        res.send(result);
                    }

                    Utils.restorePathPhoto(result.photo)
                        .then((path) => {
                            return Utils.getPhotoBase64(path, "png");
                        })
                        .then((photoData) => {
                            result.photo = photoData;
                            res.send(result);
                        })
                        .catch((error) => {
                            return next(new errors.BadGatewayError(error.message));
                        });
                })
        } catch (error) {
            return next(error);
        }
    }

    static async updateProfile(database, req, res, next) {
        try {
            await Utils.authorization(req);
            const data = req.body;
            const {typeIMG, photo} = data;
            const dataImgIndex = photo.indexOf(",");
            const base64Data = photo.substring(dataImgIndex + 1);
            let path = "Resources/photo_" + data.id_user + `.${typeIMG}`;

            if (data.photo !== "") {
                await fse.writeFile(path, base64Data, "base64")
                    .catch(() => {
                        return next(new errors.BadGatewayError("Error write file"));
                    });
            }

            await Utils.restorePathPhoto(path)
                .then((result) => {
                    path = result;
                });

            await services.updateProfile(database, data, path)
                .then(() => {
                    res.send("Success update profile");
                });
        } catch (error) {
            return next(error);
        }
    }

    static async getRole(database, req, res, next) {
        try {
            const dataUser = await Utils.authorization(req);
            const id_role = dataUser.id_role;
            await services.getRole(database, id_role)
                .then((data) => {
                    const result = {
                        role: data.name,
                        id_user: dataUser.id_user
                    };
                    res.send(result)
                });
        } catch (error) {
            return next(error);
        }
    }

    static async getRoles(database, req, res, next) {
        try {
            await services.getRoles(database)
                .then((result) => {
                    res.send(result);
                });
        } catch (error) {
            return next(error);
        }
    }

    static async getUsersByRole(database, req, res, next) {
        try {
            await Utils.authorization(req);
            const role = req.body;
            if (!Utils.isset(role)) {
                throw new errors.InvalidArgumentError("Not enough body data");
            }

            await services.getUserListByRole(database, role)
                .then((result) => {
                    res.send(result);
                });
        } catch (error) {
            return next(error);
        }
    }

    static async getAllTaskProfile(database, req, res, next) {
        try {
            const dataUser = await Utils.authorization(req);
            const id_user = dataUser.id_user;

            await services.getAllTaskProfile(database, id_user)
                .then((result) => {
                    res.send(result);
                });
        } catch (error) {
            return next(error);
        }
    }
}