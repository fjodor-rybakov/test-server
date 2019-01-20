import Utils from "../Utils/Utils";
import {FeedbackServices} from "../Services";
import * as errors from "restify-errors";

const services = new FeedbackServices();

export class FeedbackController {
    static async createFeedback(database, req, res, next) {
        try {
            const dataUser = await Utils.authorization(req);
            const id_user = dataUser.id_user;
            const id_task = req.params.taskId;
            const data = req.body.data;

            if (!Utils.isset(id_task) && !Utils.isNumeric(id_task)) {
                throw new errors.InvalidArgumentError("Incorrect params id");
            }

            await services.createFeedback(database, id_user, id_task, data)
                .then(() => {
                    res.send("Success create comment");
                });
        } catch (error) {
            return next(error);
        }
    }

    static async getAllFeedback(database, req, res, next) {
        try {
            await Utils.authorization(req);
            const id_task = req.params.taskId;

            if (!Utils.isset(id_task) && !Utils.isNumeric(id_task)) {
                throw new errors.InvalidArgumentError("Incorrect params id");
            }

            await services.getAllFeedback(database, id_task)
                .then(async (result) => {
                    if (result.photo === "") {
                        res.send(result);
                    }

                    await Utils.getPhotoBase64(result.photo, "png")
                        .then((photoData) => {
                            result.photo = photoData;
                            res.send(result);
                        })
                        .catch((error) => {
                            return next(new errors.BadGatewayError(error.message));
                        });
                });
        } catch (error) {
            return next(error);
        }
    }

    static async updateFeedback(database, req, res, next) {
        try {
            await Utils.authorization(req);
            const id_comment = req.params.feedbackId;
            const data = req.body.data;

            if (!Utils.isset(id_comment) && !Utils.isNumeric(id_comment)) {
                throw new errors.InvalidArgumentError("Incorrect params id");
            }

            await services.updateFeedback(database, data, id_comment)
                .then(() => {
                    res.send("Success update comment");
                });
        } catch (error) {
            return next(error);
        }
    }

    static async deleteFeedback(database, req, res, next) {
        try {
            await Utils.authorization(req);
            const id_comment = req.params.feedbackId;

            if (!Utils.isset(id_comment) && !Utils.isNumeric(id_comment)) {
                throw new errors.InvalidArgumentError("Incorrect params id");
            }

            await services.deleteFeedback(database, id_comment)
                .then(() => {
                    res.send("Success delete comment");
                });
        } catch (error) {
            return next(error);
        }
    }
}