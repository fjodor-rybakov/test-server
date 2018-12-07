import {addTaskTeam, createTaskImpl, getProject, getUserListByRole} from "../request-database/getProject";
import {authorization} from "../utils/authorization";

export class Project {
    static project(database, req, res, next) {
        authorization(req, res, next);
        const userId = req.params.userId;
        getProject(database, userId, next)
            .then((data) => {
                res.send(data);
            })
            .catch(() => {
                res.send("err");
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
        authorization(req, res, next);
        const data = req.body;
        await createTaskImpl(database, next, data.data)
            .then((result) => {
                addTaskTeam(database, next, data.data.developers, result[0].id)
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