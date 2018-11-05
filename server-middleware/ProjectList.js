import {getProjects} from "../request-database/getProjects";

export class ProjectList {
    static getProjectList(database, req, res, next) {
        getProjects(database, next)
            .then((data) => {
                res.send(data);
            })
            .catch(() => {
                res.send("err");
            });
    }
}