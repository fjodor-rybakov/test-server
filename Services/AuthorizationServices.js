import * as errors from "restify-errors";
import config from "../config";
import Utils from "../Utils/Utils";

export class AuthorizationServices {
    async createUser(database, data) {
        let sql = `SELECT * FROM user WHERE email = ?`;
        await database.query(sql, [data.email])
            .then((result) => {
                if (result.length !== 0) {
                    throw new errors.BadRequestError("Email already exist");
                }
            })
            .catch((error) => {
                throw new errors.BadGatewayError(error);
            });

        sql = `INSERT INTO 
                   user 
               VALUES (null, '', '', ?, '', ?, ?, 'resources/default-avatar.png')`;
        await database.query(sql, [data.role, config.crypt.encrypt(data.password), data.email])
            .catch((error) => {
                throw new errors.BadGatewayError(error);
            })
    }

    async checkUser(database, data) {
        let sql = `SELECT * FROM user WHERE email = ?`;
        return await database.query(sql, [data.email])
            .then((result) => {
                if (result.length === 0) {
                    throw new errors.NotFoundError("User not found");
                }
                return Utils.checkPassword(data.password, result);
            })
            .catch((err) => {
                throw new errors.BadGatewayError(err);
            });
    }
}