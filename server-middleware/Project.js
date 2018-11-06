import {getProject, getUserListByRole} from "../request-database/getProject";

export class Project {
    static postProject(database, req, res, next) {
        const data = JSON.parse(req.body);
        getProject(database, data, next)
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
}