import Utils from "../Utils/Utils";
import * as errors from "restify-errors";
import {ProjectServices} from "../Services";

const services = new ProjectServices();

export class ProjectController {
    static async getProjects(database, req, res, next) {
        try {
            let dataUser = await Utils.authorization(req);
            await services.getProjects(database, dataUser)
                .then((result) => {
                    res.send(result);
                });
        } catch (error) {
            return next(error);
        }
    }

    static async getProject(database, req, res, next) {
        try {
            await Utils.authorization(req);
            const id = req.params.projectId;
            if (!Utils.isset(id)) {
                throw new errors.InvalidArgumentError("Incorrect params id");
            }
            await services.getProject(database, id)
                .then((result) => {
                    res.send(result);
                });
        } catch (error) {
            return next(error);
        }
    }

    static async createProject(database, req, res, next) {
        try {
            await Utils.authorization(req);
            const data = req.body;
            if (!Utils.isset(data.description, data.id_project_type, data.id_user_client, data.title, data.is_private, data.id_user_manager)) {
                throw new errors.InvalidArgumentError("Not enough body data");
            }
            await services.createProject(database, data)
                .then((insertId) => {
                    return services.addProjectTeam(database, data.developers, insertId);
                })
                .then(() => {
                    res.send("Success create project");
                });
        } catch (error) {
            return next(error);
        }
    }

    static async updateProject(database, req, res, next) {
        try {
            await Utils.authorization(req);
            const projectId = req.params.projectId;
            if (!Utils.isset(projectId)) {
                throw new errors.InvalidArgumentError("Incorrect params id");
            }
            const data = req.body;
            await services.updateProject(database, projectId, data)
                .then(() => {
                    res.send("Success update project");
                })
        } catch (error) {
            return next(error);
        }
    }

    static async deleteProject(database, req, res, next) {
        try {
            await Utils.authorization(req);
            const projectId = req.params.projectId;
            if (!Utils.isset(projectId)) {
                throw new errors.InvalidArgumentError("Incorrect params id");
            }
            await services.deleteProject(database, projectId)
                .then(() => {
                    res.send("Success delete project");
                });
        } catch (error) {
            return next(error);
        }
    }

    static async getPopularProjects(database, req, res, next) {
        try {
            services.getPopularProjects(database)
                .then((result) => {
                    res.send(result);
                });
        } catch (error) {
            return next(error);
        }
    }

    static async getProjectTypes(database, req, res, next) {
        try {
            await Utils.authorization(req);
            await services.getProjectTypes(database, next)
                .then((data) => {
                    res.send(data);
                });
        } catch (error) {
            return next(error);
        }
    }
}