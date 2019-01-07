import * as errors from "restify-errors";

export class ProfileServices {
    async getProfile(database, id_user) {
        let sql = `SELECT * FROM user WHERE id_user = ?`;
        const options = [id_user];
        let result = await database.query(sql, options)
            .catch((error) => {
                throw new errors.BadGatewayError(error.message);
            });

        if (result.length === 0) {
            throw new errors.NotFoundError("Not found user data");
        }

        return result[0];
    }

    async updateProfile(database, data, path) {
        const sql = `UPDATE user SET 
                        first_name = ?, 
                        last_name = ?,
                        email = ?, 
                        photo = ?
                     WHERE id_user = '${data.id_user}'`;
        const options = [data.first_name, data.last_name, data.email, path];
        await database.query(sql, options)
            .catch((error) => {
                throw new errors.BadRequestError(error.message);
            });
    }

    async getRole(database, id_role) {
        let sql = `SELECT * FROM role WHERE id_role = ?`;
        const option = [id_role];
        let result = await database.query(sql, option)
            .catch((error) => {
                throw new errors.BadGatewayError(error.message)
            });

        if (result.length === 0) {
            throw new errors.NotFoundError("Not found user data");
        }

        return result[0];
    }

    async getRoles(database) {
        let sql = `SELECT * FROM role`;

        return await database.query(sql)
            .catch((error) => {
                throw new errors.BadGatewayError(error.message);
            })
    }

    async getUserListByRole(database, role) {
        let sql = `SELECT user.last_name, user.first_name, user.id_user
                       FROM role
                   LEFT JOIN user ON user.id_role = role.id_role
                       WHERE role.name = ?`;
        let options = [role];

        return await database.query(sql, options)
            .catch((error) => {
                throw new errors.BadGatewayError(error.message);
            });
    }
}