import * as errs from "restify-errors";
import config from "../config";
import Utils from "../Utils/Utils";

export class AuthorizationServices {
    async createUser(database, data) {
        let sql = `SELECT * FROM user WHERE email = ?`;
        await database.query(sql, [data.email])
            .then((result) => {
                if (result.length !== 0) {
                    throw new errs.BadRequestError("Email already exist");
                }
            })
            .catch((err) => {
                throw new errs.BadGatewayError(err);
            });

        sql = `INSERT INTO 
                   user 
               VALUES (null, '', '', ?, '', ?, ?, 'resources/default-avatar.png')`;
        await database.query(sql, [data.role, config.crypt.encrypt(data.password), data.email])
            .catch((err) => {
                throw new errs.BadGatewayError(err);
            })
    }

    async checkUser(database, data) {
        let sql = `SELECT * FROM user WHERE email = ?`;
        return await database.query(sql, [data.email])
            .then((result) => {
                if (result.length === 0) {
                    throw new errs.BadRequestError("User not found");
                }
                return Utils.checkPassword(data.password, result);
            })
            .catch((err) => {
                throw new errs.BadGatewayError(err);
            });
    }
}