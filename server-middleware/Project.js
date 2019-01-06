import {
    addProjectTeam, deleteProject, updateProject,
    addTaskTeam, createProjectImpl, createTaskImpl, getProject, getProjectTypesImpl, getTaskById,
    getUserListByRole, getPopular
} from "../request-database/getProject";
import {authorization} from "../utils/authorization";

export class Project {
    static async project(database, req, res, next) {
        await authorization(req, res, next);
        const userId = req.params.userId;
        getProject(database, userId, next)
            .then((data) => {
                res.send(data);
            });
    }

    static async deleteProject(database, req, res, next) {
        await authorization(req, res, next);
        const projectId = req.params.projectId;
        deleteProject(database, projectId, next)
            .then(() => {
                res.send("Success delete project");
            })
    }

    static async updateProject(database, req, res, next) {
        await authorization(req, res, next);
        const projectId = req.params.projectId;
        const data = req.body;
        await updateProject(database, projectId, data, next)
            .then(() => {
                res.send("Success update project");
            })
    }

    static async getTask(database, req, res, next) {
        await authorization(req, res, next);
        const id = req.params.taskId;
        getTaskById(database, id, next)
            .then((data) => {
                res.send(data);
            });
    }

    static async getProjectTypes(database, req, res, next) {
        await authorization(req, res, next);
        getProjectTypesImpl(database, next)
            .then((data) => {
                console.log(data);
                res.send({success: true, data: data});
            })
            .catch((err) => {
                res.send({success: false, data: err});
            });
    }

    static async getPopular(database, req, res, next) {
        await authorization(req, res, next);
        getPopular(database, next)
            .then((data) => {
                res.send({success: true, data: data});
            })
            .catch((err) => {
                res.send({success: false, data: err});
            });
    }

    static async createProject(database, req, res, next) {
        await authorization(req, res, next);
        const data = req.body;
        await createProjectImpl(database, next, data.data)
            .then((id) => {
                addProjectTeam(database, next, data.data.developers, id)
                    .then((data) => {
                        res.send({success: true, data: data});
                    })
                    .catch((err) => {
                        res.send({success: false, data: err});
                    });
            })
            .catch((err) => {
                res.send({success: false, data: err});
            });
    }

    static postUserListByRole(database, req, res, next) {
        const data = JSON.parse(req.body);
        getUserListByRole(database, next, data.role)
            .then((data) => {
                res.send(data);
            })
            .catch(() => {
                res.send("err");
            });
    }

    static async createTask(database, req, res, next) {
        await authorization(req, res, next);
        const data = req.body;
        await createTaskImpl(database, next, data.data)
            .then((id) => {
                addTaskTeam(database, next, data.data.developers, id)
                    .then((data) => {
                        res.send({success: true, data: data});
                    })
                    .catch((err) => {
                        res.send({success: false, data: err});
                    });
            })
            .catch((err) => {
                res.send({success: false, data: err});
            });
    }
}