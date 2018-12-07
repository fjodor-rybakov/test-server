import {getProjects} from "../request-database/getProjects";
import {authorization} from "../utils/authorization";

export class ProjectList {
    static getProjectList(database, req, res, next) {
        authorization(req, res, next);
        getProjects(database, next)
            .then((data) => {
                res.send(data);
            })
            .catch(() => {
                res.send("err");
            });
    }
}