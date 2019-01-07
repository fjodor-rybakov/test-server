import * as errors from "restify-errors";
import config from "../config";
import Utils from "../Utils/Utils";

export class AuthorizationServices {
    async createUser(database, data) {
        let sql = `SELECT * FROM user WHERE email = ?`;
        let result = await database.query(sql, [data.email])
            .catch((error) => {
                throw new errors.BadGatewayError(error);
            });

        if (result.length !== 0) {
            throw new errors.BadRequestError("Email already exist");
        }

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
        let result = await database.query(sql, [data.email])
            .catch((error) => {
                throw new errors.BadGatewayError(error);
            });

        if (result.length === 0) {
            throw new errors.NotFoundError("User not found");
        }

        Utils.checkPassword(data.password, result[0].password);

        return result[0];
    }
}