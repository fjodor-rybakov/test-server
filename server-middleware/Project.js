import {
    addProjectTeam,
    addTaskTeam, createProjectImpl, createTaskImpl, getLastInsertId, getProject, getProjectTypesImpl, getTaskById,
    getUserListByRole
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

    static async createProject(database, req, res, next) {
        await authorization(req, res, next);
        const data = req.body;
        createProjectImpl(database, next, data.data)
            .then(async () => {
                const id = await getLastInsertId(database, next);
                addProjectTeam(database, next, data.data.developers, id)
                    .then((data) => {
                        res.send( {success: true, data: data} );
                    })
                    .catch((err) => {
                        res.send( {success: false, data: err} );
                    });
            })
            .catch((err) => {
                res.send( {success: false, data: err} );
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
            .then((result) => {
                addTaskTeam(database, next, data.data.developers, getLastInsertId(database, next))
                    .then((data) => {
                        res.send( {success: true, data: data} );
                    })
                    .catch((err) => {
                        res.send( {success: false, data: err} );
                    });
            })
            .catch((err) => {
                res.send( {success: false, data: err} );
            });
    }
}