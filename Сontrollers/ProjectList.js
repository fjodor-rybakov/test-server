import {getProjects} from "../Services/getProjects";
import {authorization} from "../Utils/authorization";

export class ProjectList {
    static getProjectList(database, req, res, next) {
        let dataUser = authorization(req, res, next);
        getProjects(database, dataUser, next)
            .then((data) => {
                res.send(data);
            });
    }
}