import {authorization} from "../Utils/authorization";
import {getCreateProjectPermission, getCreateTrackPermission, getCreateTaskPermission} from "../Services/Permissions";

export class Permission {
    static async CreateProjectPermission(database, req, res, next) {
        const userData = await authorization(req, res, next);
        getCreateProjectPermission(database, userData.id_role, next)
            .then((data) => {
                res.send(data);
            });
    }

    static async CreateTrackPermission(database, req, res, next) {
        const userData = await authorization(req, res, next);
        const idTask = req.params.taskId;
        getCreateTrackPermission(database, userData.id_user, idTask, next)
            .then(() => {
                res.send(true);
            });
    }

    static async CreateTaskPermission(database, req, res, next) {
        const userData = await authorization(req, res, next);
        const idProject = req.params.projectId;
        await getCreateTaskPermission(database, userData.id_user, idProject, next)
            .then((data) => {
                res.send({value: data});
            });
    }
}