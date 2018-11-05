import {getProject} from "../request-database/getProject";

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
}