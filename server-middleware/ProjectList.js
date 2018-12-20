import {getProjects} from "../request-database/getProjects";
import {authorization} from "../utils/authorization";

export class ProjectList {
    static getProjectList(database, req, res, next) {
        let dataUser = authorization(req, res, next);
        getProjects(database, dataUser, next)
            .then((data) => {
                res.send(data);
            });
    }
}