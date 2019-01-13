import * as errors from "restify-errors";

export class ProjectServices {
    async getProjects(database, dataUser) {
        let id = dataUser.id_user;
        let sql = `SELECT 
                       project.id_project, description, id_project_type, id_user_client, status, title, is_private, id_project_manager 
                   FROM project
                       LEFT JOIN project_and_user ON project_and_user.id_project = project.id_project
                   WHERE 
                       id_user = ? OR 
                       project.id_project_manager = ? OR 
                       project.id_user_client = ? OR 
                       project.is_private = false
                   GROUP BY project.id_project`;
        const option = [id, id, id];

        return database.query(sql, option)
            .catch((error) => {
                throw new errors.BadGatewayError(error.message);
            });
    }

    async getProject(database, userId) {
        let sql = `SELECT * FROM project WHERE id_project = ?`;
        let option = [userId];
        let info = await database.query(sql, option)
            .catch((error) => {
                throw new errors.BadRequestError(error.message);
            });

        if (info.length === 0) {
            throw new errors.NotFoundError("Project not found");
        }

        // sql = `SELECT
        //            project.description,
        //            project.status,
        //            project.title,
        //            project.is_private,
        //            user.id_user,
        //            first_name,
        //            last_name,
        //            role.name as role
        //        FROM project
        //            LEFT JOIN project_and_user ON project_and_user.id_project = project.id_project
        //            LEFT JOIN user ON project_and_user.id_user = user.id_user
        //            LEFT JOIN role ON user.id_role = role.id_role
        //        WHERE project.id_project = ?`;

        sql = `SELECT
                   user.id_user, first_name, last_name, role.name as role
               FROM project_and_user 
                   LEFT JOIN user ON project_and_user.id_user = user.id_user
                   LEFT JOIN role ON user.id_role = role.id_role
               WHERE id_project = ?`;
        option = [userId];
        let team = await database.query(sql, option)
            .catch((error) => {
                throw new errors.BadRequestError(error.message);
            });

        let testers = [];
        let dev = [];
        team.map((item) => {
            if (item.role === "tester") {
                testers.push(item);
            } else {
                dev.push(item);
            }
        });


        return {
            data: info[0],
            developers: dev,
            testers: testers
        };
    }

    async createProject(database, data) {
        let sql = `INSERT INTO project VALUES (null, ?, ?, ?, 'open', ?, ?, ?)`;
        const options = [data.description, data.id_project_type, data.id_user_client, data.title, data.is_private, data.id_user_manager];
        let result = await database.query(sql, options)
            .catch((error) => {
                throw new errors.BadGatewayError(error.message);
            });

        return result.insertId;
    }

    async addProjectTeam(database, developers, project_id) {
        for (let i = 0; i < developers.length; i++) {
            let sql = `INSERT INTO project_and_user VALUES (null, ?, ?)`;
            let options = [developers[i].id_user, project_id];
            await database.query(sql, options)
                .catch((error) => {
                    throw new errors.BadGatewayError(error.message);
                });
        }
    }

    async updateProject(database, projectId, data) {
        let sql = `UPDATE project SET 
                       description = ?,
                       id_project_type = ?,
                       id_user_client = ?,
                       status = ?,
                       title = ?,
                       is_private = ?, 
                       id_project_manager = ?
                       WHERE id_project = ?`;
        const options = [
            data.description,
            data.id_project_type,
            data.id_user_client,
            data.status,
            data.title,
            data.is_private,
            data.id_user_manager,
            projectId
        ];

        return await database.query(sql, options)
            .catch((error) => {
                throw new errors.BadGatewayError(error.message);
            });
    }

    async deleteProject(database, projectId) {
        let sql = `DELETE FROM project_and_user WHERE id_project = ?`;
        let options = [projectId];
        await database.query(sql, options)
            .catch((error) => {
                throw new errors.BadGatewayError(error.message);
            });

        sql = `DELETE FROM project WHERE id_project = ?`;
        return await database.query(sql, options)
            .catch((error) => {
                throw new errors.BadGatewayError(error.message);
            });
    }

    async getPopularProjects(database) {
        let sql = `SELECT 
                       COUNT(id_project_and_user) AS members_count, project.id_project, title
                   FROM project_and_user 
                       LEFT JOIN project ON project_and_user.id_project = project.id_project
                   GROUP BY project.id_project 
                   ORDER BY members_count DESC LIMIT 3`;

        return await database.query(sql)
            .catch((error) => {
                throw new errors.BadGatewayError(error.message);
            })
    }

    async getProjectTypes(database) {
        let sql = `SELECT * FROM project_type`;
        return await database.query(sql)
            .catch((error) => {
                throw new errors.BadGatewayError(error.message);
            });
    }
}